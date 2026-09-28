import { useState, useCallback, useId } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';
import { LegalModal } from '@/components/legal/LegalModal';
import { TermsAcceptance } from '@/components/legal/TermsAcceptance';
import { MarketingConsent } from '@/components/legal/MarketingConsent';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useAlquileres()      →  src/hooks/queries/useAlquileres.ts
// Service:   alquileresService    →  src/api/services/alquileresService.ts
// Endpoint:  GET /api/alquileres
// Paginado:  paginateItems()      →  src/utils/paginationUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
import { useAlquileres } from '@/hooks/queries/useAlquileres';
import { usePagination } from '@/hooks/usePagination';
import { useConsentimientos } from '@/hooks/useConsentimientos';
import { paginateItems } from '@/utils/paginationUtils';
import { formatMoney } from '@/utils/formatters';
import { terminosYCondiciones } from '@/legal/terminos';
import { politicaDePrivacidad } from '@/legal/privacidad';
import type { Alquiler, ConsultaAlquilerPayload } from '@/types';

// ─── AlquilerCard ─────────────────────────────────────────────────────────────

function AlquilerCard({ a }: { a: Alquiler }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {a.imagen ? (
          <img src={a.imagen} alt={a.titulo} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center"><span className="text-4xl">🏢</span></div>
        )}
        <span className={[
          'absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
          a.disponible
            ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
        ].join(' ')}>
          {a.disponible
            ? <><CheckCircle className="h-3 w-3" aria-hidden="true" /> Disponible</>
            : <><XCircle className="h-3 w-3" aria-hidden="true" /> No disponible</>}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{a.titulo}</h2>
        <p className="mb-3 flex-1 text-sm text-gray-600 dark:text-gray-400">{a.descripcion}</p>

        <div className="mb-4 space-y-1.5">
          {a.direccion && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {a.direccion}
            </div>
          )}
          {a.precio !== null && (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {formatMoney(a.precio, a.moneda)} / mes
            </div>
          )}
        </div>

        {(a.contactoNombre ?? a.contactoTelefono ?? a.contactoEmail) && (
          <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
            {a.contactoNombre && (
              <p className="mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">{a.contactoNombre}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {a.contactoTelefono && (
                <a href={`tel:${a.contactoTelefono}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400">
                  <Phone className="h-3 w-3" aria-hidden="true" />{a.contactoTelefono}
                </a>
              )}
              {a.contactoEmail && (
                <a href={`mailto:${a.contactoEmail}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400">
                  <Mail className="h-3 w-3" aria-hidden="true" />{a.contactoEmail}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Estado del formulario de consulta ───────────────────────────────────────

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const FORM_INITIAL: FormState = { nombre: '', email: '', telefono: '', mensaje: '' };

interface FormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

// ─── Formulario de consulta ───────────────────────────────────────────────────

/**
 * ConsultaAlquilerForm
 *
 * Formulario de consulta sobre alquileres.
 *
 * FLUJO:
 *   1. Usuario completa campos
 *   2. Usuario acepta T&C y Política de Privacidad (obligatorio)
 *   3. Usuario decide si acepta recibir novedades (opcional)
 *   4. Validación de campos + consentimientos
 *   5. Construcción del payload con consentimientos + versiones
 *   6. Envío al backend (POST /alquileres/consulta)
 *
 * BACKEND:
 *   Ver CONSENTIMIENTOS_BACKEND.md para el contrato completo.
 *   El backend registra timestamp e IP del servidor.
 *
 * @param espacioSeleccionado - ID del espacio seleccionado (null si no aplica)
 */
function ConsultaAlquilerForm({ espacioSeleccionado }: { espacioSeleccionado: number | null }) {
  const uid = useId();
  const [form, setForm] = useState<FormState>(FORM_INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Consentimientos
  const consent = useConsentimientos();

  // ── Handlers de campos ───────────────────────────────────────────────────

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  // ── Validación de campos ─────────────────────────────────────────────────

  const validateFields = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Ingresá una dirección de correo válida.';
    }

    if (!form.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido.';
    } else if (form.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // ── Envío ────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const fieldsOk = validateFields();
      const consentOk = consent.validar();

      if (!fieldsOk || !consentOk) return;

      // Construcción del payload
      // El backend agrega timestamp e IP del servidor (ver CONSENTIMIENTOS_BACKEND.md)
      const payload: ConsultaAlquilerPayload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        mensaje: form.mensaje.trim(),
        espacioId: espacioSeleccionado,
        consentimientos: consent.buildPayload(),
      };

      setStatus('sending');

      try {
        // TODO: Reemplazar con el servicio real cuando el backend implemente el endpoint.
        // Servicio esperado: alquileresService.sendConsulta(payload)
        // Endpoint esperado: POST /api/v1/alquileres/consulta
        // Ver CONSENTIMIENTOS_BACKEND.md para el contrato completo.
        await new Promise<void>((resolve) => setTimeout(resolve, 1200));
        console.info('[ConsultaAlquiler] Payload a enviar:', JSON.stringify(payload, null, 2));

        setStatus('success');
        setForm(FORM_INITIAL);
        consent.limpiarError();
      } catch {
        setStatus('error');
      }
    },
    [form, consent, validateFields, espacioSeleccionado],
  );

  const handleReset = () => {
    setStatus('idle');
    setErrors({});
  };

  // ── Render: éxito ─────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-6 text-center dark:border-secondary-800 dark:bg-secondary-900/20">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          ¡Consulta enviada!
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Nos pondremos en contacto a la brevedad.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Hacer otra consulta
        </button>
      </div>
    );
  }

  // ── Render: formulario ────────────────────────────────────────────────────

  return (
    <section
      aria-labelledby="form-consulta-title"
      className="rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>
        <h2 id="form-consulta-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Consultar sobre un espacio
        </h2>
      </div>

      {status === 'error' && (
        <div className="mb-4">
          <ErrorBanner
            message="No se pudo enviar la consulta. Por favor intentá nuevamente."
            onRetry={handleReset}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Formulario de consulta de alquiler">
        <div className="space-y-4">

          {/* Nombre */}
          <div>
            <label htmlFor={`${uid}-nombre`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre y apellido <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id={`${uid}-nombre`}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              autoComplete="name"
              aria-required="true"
              aria-describedby={errors.nombre ? `${uid}-nombre-error` : undefined}
              placeholder="Tu nombre completo"
              className={[
                'block w-full rounded-lg border px-3 py-2.5 text-sm',
                'text-gray-900 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-500',
                'bg-white dark:bg-gray-900/50',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-colors',
                errors.nombre
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}
            />
            {errors.nombre && (
              <p id={`${uid}-nombre-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor={`${uid}-email`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id={`${uid}-email`}
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-required="true"
              aria-describedby={errors.email ? `${uid}-email-error` : undefined}
              placeholder="tu@email.com"
              className={[
                'block w-full rounded-lg border px-3 py-2.5 text-sm',
                'text-gray-900 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-500',
                'bg-white dark:bg-gray-900/50',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-colors',
                errors.email
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}
            />
            {errors.email && (
              <p id={`${uid}-email-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor={`${uid}-telefono`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="tel"
              id={`${uid}-telefono`}
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="(011) 1234-5678"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor={`${uid}-mensaje`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mensaje <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id={`${uid}-mensaje`}
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              rows={4}
              aria-required="true"
              aria-describedby={errors.mensaje ? `${uid}-mensaje-error` : undefined}
              placeholder="Contanos sobre el espacio que buscás, fechas tentativas, etc."
              className={[
                'block w-full resize-none rounded-lg border px-3 py-2.5 text-sm',
                'text-gray-900 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-500',
                'bg-white dark:bg-gray-900/50',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-colors',
                errors.mensaje
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}
            />
            {errors.mensaje && (
              <p id={`${uid}-mensaje-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.mensaje}
              </p>
            )}
          </div>

          {/* ── Consentimientos ───────────────────────────────────────────── */}
          <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
            <TermsAcceptance
              id={`${uid}-terms`}
              accepted={consent.consentimientos.terminosYCondiciones && consent.consentimientos.politicaDePrivacidad}
              onChange={(v) => { consent.setTerminos(v); consent.setPrivacidad(v); }}
              onOpenTerminos={consent.abrirTerminos}
              onOpenPrivacidad={consent.abrirPrivacidad}
              error={consent.errorConsentimientos}
            />
            <MarketingConsent
              id={`${uid}-marketing`}
              accepted={consent.consentimientos.marketing}
              onChange={consent.setMarketing}
            />
          </div>

          {/* Campo obligatorio */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <span className="text-red-500" aria-hidden="true">*</span> Campos obligatorios
          </p>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white',
              'transition-all active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
              status === 'sending'
                ? 'cursor-not-allowed bg-primary-400'
                : 'bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md',
            ].join(' ')}
          >
            {status === 'sending' ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Enviar consulta
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modales de documentos legales */}
      <LegalModal
        isOpen={consent.modalAbierto === 'terminos'}
        onClose={consent.cerrarModal}
        documento={terminosYCondiciones}
      />
      <LegalModal
        isOpen={consent.modalAbierto === 'privacidad'}
        onClose={consent.cerrarModal}
        documento={politicaDePrivacidad}
      />
    </section>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AlquileresPage() {
  // ── Obtención de datos ──────────────────────────────────────────────────
  const { data, isPending, isError, refetch } = useAlquileres();

  // ── Paginación ──────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(data ?? [], page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Alquileres — {SITE_NAME}</title>
        <meta name="description" content="Inmuebles y espacios disponibles para alquiler en la institución. Realizá tu consulta en línea." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Alquileres</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Espacios y consultorios disponibles</p>
        </header>

        {isPending && <CardSkeletonGrid count={4} />}
        {isError && <ErrorBanner message="No se pudieron cargar los alquileres." onRetry={refetch} />}
        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState title="Sin alquileres" description="No hay espacios disponibles por el momento." />
        )}

        {paginatedItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((a) => (
                <AlquilerCard key={a.id} a={a} />
              ))}
            </div>

            <Pagination
              id="alquileres"
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              from={from}
              to={to}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}

        {/* Formulario de consulta */}
        {!isPending && (
          <div className="mt-12 max-w-lg">
            <ConsultaAlquilerForm espacioSeleccionado={null} />
          </div>
        )}
      </div>
    </Layout>
  );
}
