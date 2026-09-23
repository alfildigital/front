import { AlertCircle } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TermsAcceptanceProps {
  /** ID único del checkbox (para asociar el label). Debe ser único en la página. */
  id: string;
  /** Estado actual de aceptación */
  accepted: boolean;
  /** Callback al cambiar el checkbox */
  onChange: (v: boolean) => void;
  /** Callback para abrir el modal de Términos y Condiciones */
  onOpenTerminos: () => void;
  /** Callback para abrir el modal de Política de Privacidad */
  onOpenPrivacidad: () => void;
  /** Mensaje de error de validación (se muestra si se intentó enviar sin aceptar) */
  error?: string | null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * TermsAcceptance
 *
 * Checkbox de aceptación obligatoria de Términos y Condiciones y Política de Privacidad.
 *
 * DISEÑO:
 *   - Un único checkbox agrupa ambos consentimientos obligatorios.
 *   - Los enlaces a cada documento son independientes y abren el LegalModal.
 *   - El formulario no puede enviarse si no está marcado.
 *   - Si se intenta enviar sin marcar, se muestra el mensaje de error.
 *
 * ACCESIBILIDAD:
 *   - checkbox con id único + label asociado
 *   - aria-required="true"
 *   - aria-describedby apuntando al mensaje de error cuando existe
 *   - Los botones de apertura de documentos tienen type="button" para no disparar submit
 */
export function TermsAcceptance({
  id,
  accepted,
  onChange,
  onOpenTerminos,
  onOpenPrivacidad,
  error,
}: TermsAcceptanceProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-required="true"
          aria-describedby={error ? errorId : undefined}
          className={[
            'mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded',
            'border-gray-300 text-primary-600',
            'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
            'dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900',
            error ? 'border-red-500 dark:border-red-500' : '',
          ].join(' ')}
        />
        <label
          htmlFor={id}
          className="cursor-pointer text-sm leading-relaxed text-gray-700 dark:text-gray-300"
        >
          He leído y acepto los{' '}
          <button
            type="button"
            onClick={onOpenTerminos}
            className={[
              'font-medium text-primary-600 underline underline-offset-2',
              'hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
              'focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
            ].join(' ')}
          >
            Términos y Condiciones
          </button>{' '}
          y la{' '}
          <button
            type="button"
            onClick={onOpenPrivacidad}
            className={[
              'font-medium text-primary-600 underline underline-offset-2',
              'hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
              'focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
            ].join(' ')}
          >
            Política de Privacidad
          </button>
          .{' '}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </label>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
