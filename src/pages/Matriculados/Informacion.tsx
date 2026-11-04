import { Helmet } from 'react-helmet-async';
import { useState, type FormEvent, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, FileText, LoaderCircle, Send, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Reveal } from '@/components/common/Reveal';
import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';

export default function InformacionPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dni, setDni] = useState('');
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'exito' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const estadoRef = useRef(estado);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    estadoRef.current = estado;
    if (estado === 'exito') cerrarRef.current?.focus();
  }, [estado]);

  useEffect(() => {
    if (!modalAbierto) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && estadoRef.current !== 'enviando') {
        setModalAbierto(false);
        setEstado('idle');
        setDni('');
      }

      if (event.key === 'Tab') {
        const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.removeEventListener('keydown', cerrarConEscape);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [modalAbierto]);

  const enviarSolicitud = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dniSolicitante = dni.trim();
    if (!dniSolicitante) return;

    setEstado('enviando');
    try {
      const { data } = await apiClient.post<ApiResponse<null>>(
        ENDPOINTS.matriculados.solicitarDetallePagos,
        { dni: dniSolicitante },
      );

      if (!data.success) {
        setEstado('error');
        return;
      }

      setEstado('exito');
    } catch {
      setEstado('error');
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEstado('idle');
    setDni('');
  };

  return (
    <Layout>
      <Helmet>
        <title>Consulta de pagos de matrícula por DNI | Colegio Profesional</title>
        <meta
          name="description"
          content="Solicitá información sobre tus pagos de matrícula indicando tu DNI. El Colegio revisará tu consulta y responderá por sus canales institucionales."
        />
        <link rel="canonical" href="https://colegioedespecial.org.ar/matriculados/informacion" />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Información Institucional
          </h1>
        </Reveal>

        <article className="rounded-xl border border-secondary-300 bg-primary-100/20 p-6 shadow-md hover:shadow-primary-500/20 dark:border-primary-700 dark:bg-gray-800/50 dark:hover:shadow-secondary-500/20">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Información de pagos
          </h2>
          <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
            Solicitá información sobre tus pagos de matrícula indicando tu DNI.
          </p>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Solicitar información de pagos
          </button>
        </article>
      </div>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && estado !== 'enviando') cerrarModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="solicitud-pagos-titulo"
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="solicitud-pagos-titulo" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Solicitar información de pagos
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Ingresá tu DNI para identificar tu matrícula.
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarModal}
                disabled={estado === 'enviando'}
                aria-label="Cerrar"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {estado === 'exito' ? (
              <div role="status" className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p>Recibimos tu solicitud.</p>
              </div>
            ) : (
              <form onSubmit={enviarSolicitud}>
                <label htmlFor="dni-matriculado" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  DNI
                </label>
                <input
                  ref={inputRef}
                  id="dni-matriculado"
                  name="dni"
                  type="text"
                  value={dni}
                  onChange={(event) => setDni(event.target.value)}
                  inputMode="numeric"
                  pattern="\d{7,8}"
                  maxLength={8}
                  required
                  disabled={estado === 'enviando'}
                  autoComplete="off"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />

                {estado === 'error' && (
                  <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    No pudimos enviar la solicitud. Intentá nuevamente más tarde.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === 'enviando' || !/^\d{7,8}$/.test(dni.trim())}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {estado === 'enviando' ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </form>
            )}

            {estado === 'exito' && (
              <button
                type="button"
                onClick={cerrarModal}
                ref={cerrarRef}
                className="mt-5 w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Cerrar
              </button>
            )}
          </section>
        </div>
      )}
    </Layout>
  );
}
