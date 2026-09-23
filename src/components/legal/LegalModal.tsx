import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import type { LegalDocument } from '@/legal/terminos';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LegalModalProps {
  /** Controla si el modal está abierto */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Documento legal a mostrar */
  documento: LegalDocument;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * LegalModal
 *
 * Modal accesible para visualizar documentos legales (T&C, Política de Privacidad).
 *
 * ACCESIBILIDAD:
 *   - role="dialog" + aria-modal="true" + aria-labelledby
 *   - Cierre con tecla Escape
 *   - Foco se mueve al modal al abrir; se restaura al elemento previo al cerrar
 *   - Trap de foco: Tab/Shift+Tab cicla solo dentro del modal
 *   - Botón de cierre con aria-label descriptivo
 *
 * EXPERIENCIA:
 *   - Overlay oscuro semitransparente con blur
 *   - El formulario de fondo NO se destruye ni pierde estado
 *   - Scroll interno para documentos largos
 *   - Funciona en mobile y desktop
 *
 * VERSIONADO:
 *   - Muestra la versión y fecha de vigencia del documento
 */
export function LegalModal({ isOpen, onClose, documento }: LegalModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const titleId = 'legal-modal-title';

  // ── Foco y trap ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    // Guardar el elemento con foco actual para restaurarlo al cerrar
    previousFocusRef.current = document.activeElement;

    // Mover foco al diálogo
    const dialog = dialogRef.current;
    if (dialog) {
      // Pequeño timeout para que el DOM esté pintado
      const timer = setTimeout(() => dialog.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // ── Cierre con Escape ────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Trap de foco con Tab
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ── Bloquear scroll del body mientras el modal está abierto ──────────────

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Cierre al hacer clic en el overlay ───────────────────────────────────

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={handleOverlayClick}
      aria-hidden="false"
    >
      {/* Diálogo */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          'relative flex max-h-[90vh] w-full max-w-2xl flex-col',
          'rounded-2xl border border-gray-200 bg-white shadow-2xl',
          'dark:border-gray-700 dark:bg-gray-900',
          'outline-none',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <div className="pr-4">
            <h2
              id={titleId}
              className="text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              {documento.titulo}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Versión {documento.version} · Vigente desde{' '}
              {new Date(documento.fechaVigencia + 'T00:00:00').toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Cerrar ${documento.titulo}`}
            className={[
              'flex-shrink-0 rounded-lg p-2',
              'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
              'dark:hover:bg-gray-800 dark:hover:text-gray-300',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
            ].join(' ')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Subtítulo introductorio */}
          {documento.subtitulo && (
            <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {documento.subtitulo}
            </p>
          )}

          {/* Secciones */}
          <div className="space-y-6">
            {documento.secciones.map((seccion) => (
              <section key={seccion.id} aria-labelledby={`section-${seccion.id}`}>
                <h3
                  id={`section-${seccion.id}`}
                  className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  {seccion.titulo}
                </h3>
                <div className="space-y-2">
                  {seccion.parrafos.map((parrafo, idx) => (
                    <p
                      key={idx}
                      className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                    >
                      {parrafo}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 justify-end border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={[
              'rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white',
              'hover:bg-primary-700 active:scale-95',
              'transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'dark:focus:ring-offset-gray-900',
            ].join(' ')}
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
