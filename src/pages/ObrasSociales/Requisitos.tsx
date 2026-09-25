import { useState, useCallback, useId } from 'react';
import { Helmet } from 'react-helmet-async';
import { Info, CheckCircle, Send, ClipboardList } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { LegalModal } from '@/components/legal/LegalModal';
import { TermsAcceptance } from '@/components/legal/TermsAcceptance';
import { MarketingConsent } from '@/components/legal/MarketingConsent';
import { useConsentimientos } from '@/hooks/useConsentimientos';
import { terminosYCondiciones } from '@/legal/terminos';
import { politicaDePrivacidad } from '@/legal/privacidad';
import type { SolicitudObraSocialPayload } from '@/types';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Formulario: solicitud de incorporación al convenio de obras sociales
// Endpoint esperado: POST /api/v1/obras-sociales/solicitud
// Ver CONSENTIMIENTOS_BACKEND.md para el contrato completo.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Estado del formulario ───────────────────────────────────────────────────

interface FormState {
  nombre: string;
  email: string;
  especialidad: string;
  mensaje: string;
}

const FORM_INITIAL: FormState = {
  nombre: '',
  email: '',
  especialidad: '',
  mensaje: '',
};

interface FormErrors {
  nombre?: string;
  email?: string;
  especialidad?: string;
  mensaje?: string;
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function RequisitosOsPage() {
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

    if (!form.especialidad.trim()) {
      newErrors.especialidad = 'La especialidad es requerida.';
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
      const payload: SolicitudObraSocialPayload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        especialidad: form.especialidad.trim(),
        mensaje: form.mensaje.trim(),
        consentimientos: consent.buildPayload(),
      };

      setStatus('sending');

      try {
        // TODO: Reemplazar con el servicio real cuando el backend implemente el endpoint.
        // Servicio esperado: obrasSocialesService.sendSolicitud(payload)
        // Endpoint esperado: POST /api/v1/obras-sociales/solicitud
        // Ver CONSENTIMIENTOS_BACKEND.md para el contrato completo.
        await new Promise<void>((resolve) => setTimeout(resolve, 1200));
        console.info('[SolicitudObraSocial] Payload a enviar:', JSON.stringify(payload, null, 2));

        setStatus('success');
        setForm(FORM_INITIAL);
        consent.limpiarError();
      } catch {
        setStatus('error');
      }
    },
    [form, consent, validateFields],
  );

  const handleReset = () => {
    setStatus('idle');
    setErrors({});
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <Helmet>
        <title>Requisitos para Incorporación — {SITE_NAME}</title>
        <meta
          name="description"
          content="Requisitos para que una obra social se incorpore al convenio. Enviá tu solicitud en línea."
        />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Requisitos para Incorporación
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Requisitos para que una obra social se incorpore al convenio
          </p>
        </header>

        {/* Información general */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden="true" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium">Proceso de incorporación</p>
              <p className="mt-1">
                Para iniciar el proceso de incorporación, completá el formulario a continuación.
                Un representante de la institución se comunicará con vos para coordinar los pasos
                siguientes y brindarte la documentación requerida.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario o estado de éxito */}
        {status === 'success' ? (
          <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-8 text-center dark:border-secondary-800 dark:bg-secondary-900/20">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ¡Solicitud enviada!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Recibimos tu solicitud de incorporación. Nos comunicaremos con vos a la brevedad para
              informarte los próximos pasos.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-5 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <section
            aria-labelledby="form-solicitud-title"
            className="rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <ClipboardList className="h-5 w-5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              </div>
              <h2 id="form-solicitud-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Solicitud de incorporación
              </h2>
            </div>

            {status === 'error' && (
              <div className="mb-4">
                <ErrorBanner
                  message="No se pudo enviar la solicitud. Por favor intentá nuevamente."
                  onRetry={handleReset}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Formulario de solicitud de incorporación a obra social">
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
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
                      errors.nombre ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
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
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
                      errors.email ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                    ].join(' ')}
                  />
                  {errors.email && (
                    <p id={`${uid}-email-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Especialidad */}
                <div>
                  <label htmlFor={`${uid}-especialidad`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Especialidad <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id={`${uid}-especialidad`}
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.especialidad ? `${uid}-especialidad-error` : undefined}
                    placeholder="Ej: Educación especial, fonoaudiología..."
                    className={[
                      'block w-full rounded-lg border px-3 py-2.5 text-sm',
                      'text-gray-900 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-500',
                      'bg-white dark:bg-gray-900/50',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
                      errors.especialidad ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                    ].join(' ')}
                  />
                  {errors.especialidad && (
                    <p id={`${uid}-especialidad-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.especialidad}
                    </p>
                  )}
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
                    placeholder="Describí brevemente el motivo de tu solicitud y el nombre de la obra social."
                    className={[
                      'block w-full resize-none rounded-lg border px-3 py-2.5 text-sm',
                      'text-gray-900 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-500',
                      'bg-white dark:bg-gray-900/50',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
                      errors.mensaje ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                    ].join(' ')}
                  />
                  {errors.mensaje && (
                    <p id={`${uid}-mensaje-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.mensaje}
                    </p>
                  )}
                </div>

                {/* ── Consentimientos ─────────────────────────────────────── */}
                <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <TermsAcceptance
                    id={`${uid}-terms`}
                    accepted={
                      consent.consentimientos.terminosYCondiciones &&
                      consent.consentimientos.politicaDePrivacidad
                    }
                    onChange={(v) => {
                      consent.setTerminos(v);
                      consent.setPrivacidad(v);
                    }}
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
                      Enviar solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

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
      </div>
    </Layout>
  );
}
