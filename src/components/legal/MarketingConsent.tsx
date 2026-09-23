// ─── Props ────────────────────────────────────────────────────────────────────

interface MarketingConsentProps {
  /** ID único del checkbox (para asociar el label). Debe ser único en la página. */
  id: string;
  /** Estado actual del consentimiento */
  accepted: boolean;
  /** Callback al cambiar el checkbox */
  onChange: (v: boolean) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * MarketingConsent
 *
 * Checkbox independiente para el consentimiento de comunicaciones comerciales.
 *
 * REGLAS:
 *   - NO es obligatorio. El formulario puede enviarse sin marcarlo.
 *   - NO viene marcado por defecto.
 *   - Es un consentimiento separado e independiente de TermsAcceptance.
 *   - El backend lo registra de forma independiente.
 *
 * SEPARACIÓN CONCEPTUAL:
 *   - TermsAcceptance = aceptación legal obligatoria (T&C + Privacidad)
 *   - MarketingConsent = consentimiento voluntario para comunicaciones (Ley 25.326 art. 27)
 *
 * ACCESIBILIDAD:
 *   - checkbox con id único + label asociado
 *   - Sin aria-required (no es obligatorio)
 */
export function MarketingConsent({ id, accepted, onChange }: MarketingConsentProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={id}
        checked={accepted}
        onChange={(e) => onChange(e.target.checked)}
        className={[
          'mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded',
          'border-gray-300 text-primary-600',
          'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          'dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900',
        ].join(' ')}
      />
      <label
        htmlFor={id}
        className="cursor-pointer text-sm leading-relaxed text-gray-600 dark:text-gray-400"
      >
        Deseo recibir novedades, actividades e información institucional de la institución.{' '}
        <span className="text-xs text-gray-400 dark:text-gray-500">(Opcional)</span>
      </label>
    </div>
  );
}
