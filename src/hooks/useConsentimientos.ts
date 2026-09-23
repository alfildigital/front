import { useState, useCallback } from 'react';
import { terminosYCondiciones } from '@/legal/terminos';
import { politicaDePrivacidad } from '@/legal/privacidad';

// ─── Tipos internos ───────────────────────────────────────────────────────────

export type DocumentoLegal = 'terminos' | 'privacidad';

export interface EstadoConsentimientos {
  terminosYCondiciones: boolean;
  politicaDePrivacidad: boolean;
  marketing: boolean;
}

export interface UseConsentimientosReturn {
  /** Estado actual de cada consentimiento */
  consentimientos: EstadoConsentimientos;
  /** Cuál documento está abierto en el modal, o null si ninguno */
  modalAbierto: DocumentoLegal | null;
  /** Mensaje de error si se intentó enviar sin aceptar los obligatorios */
  errorConsentimientos: string | null;

  // ── Handlers de checkboxes ────────────────────────────────────────────────
  setTerminos: (v: boolean) => void;
  setPrivacidad: (v: boolean) => void;
  setMarketing: (v: boolean) => void;

  // ── Handlers del modal ────────────────────────────────────────────────────
  abrirTerminos: () => void;
  abrirPrivacidad: () => void;
  cerrarModal: () => void;

  // ── Validación ───────────────────────────────────────────────────────────
  /**
   * Valida que los consentimientos obligatorios estén aceptados.
   * Actualiza `errorConsentimientos` con el mensaje apropiado.
   * @returns true si la validación pasa, false si hay errores.
   */
  validar: () => boolean;

  /** Limpia el error de consentimientos (útil al desmontar o reiniciar el formulario) */
  limpiarError: () => void;

  // ── Datos para el payload ─────────────────────────────────────────────────
  /**
   * Construye el objeto de consentimientos listo para enviar al backend.
   * Incluye versiones de los documentos.
   */
  buildPayload: () => {
    terminosYCondiciones: boolean;
    politicaDePrivacidad: boolean;
    marketing: boolean;
    versionTerminos: string;
    versionPolitica: string;
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useConsentimientos
 *
 * Encapsula todo el estado y la lógica relacionada con los consentimientos
 * legales del usuario: checkboxes de T&C, Política de Privacidad y Marketing,
 * control del modal de documentos, validación antes del envío, y construcción
 * del payload para el backend.
 *
 * USO:
 *   const consent = useConsentimientos();
 *   // Usar consent.consentimientos, consent.abrirTerminos, consent.validar, etc.
 *   // Al enviar: payload.consentimientos = consent.buildPayload()
 *
 * FLUJO:
 *   1. El usuario hace clic en "Términos" → se llama a abrirTerminos() → el modal se abre
 *   2. El usuario cierra el modal → cerrarModal()
 *   3. El usuario marca los checkboxes → setTerminos() / setPrivacidad() / setMarketing()
 *   4. Antes de enviar el formulario → validar() → devuelve true/false
 *   5. Si true → buildPayload() → incluir en el payload del formulario
 */
export function useConsentimientos(): UseConsentimientosReturn {
  const [consentimientos, setConsentimientos] = useState<EstadoConsentimientos>({
    terminosYCondiciones: false,
    politicaDePrivacidad: false,
    marketing: false,
  });

  const [modalAbierto, setModalAbierto] = useState<DocumentoLegal | null>(null);
  const [errorConsentimientos, setErrorConsentimientos] = useState<string | null>(null);

  // ── Handlers de checkboxes ────────────────────────────────────────────────

  const setTerminos = useCallback((v: boolean) => {
    setConsentimientos((prev) => ({ ...prev, terminosYCondiciones: v }));
    if (v) setErrorConsentimientos(null);
  }, []);

  const setPrivacidad = useCallback((v: boolean) => {
    setConsentimientos((prev) => ({ ...prev, politicaDePrivacidad: v }));
    if (v) setErrorConsentimientos(null);
  }, []);

  const setMarketing = useCallback((v: boolean) => {
    setConsentimientos((prev) => ({ ...prev, marketing: v }));
  }, []);

  // ── Handlers del modal ────────────────────────────────────────────────────

  const abrirTerminos = useCallback(() => setModalAbierto('terminos'), []);
  const abrirPrivacidad = useCallback(() => setModalAbierto('privacidad'), []);
  const cerrarModal = useCallback(() => setModalAbierto(null), []);

  // ── Validación ───────────────────────────────────────────────────────────

  const validar = useCallback((): boolean => {
    if (!consentimientos.terminosYCondiciones && !consentimientos.politicaDePrivacidad) {
      setErrorConsentimientos(
        'Debés aceptar los Términos y Condiciones y la Política de Privacidad para continuar.',
      );
      return false;
    }
    if (!consentimientos.terminosYCondiciones) {
      setErrorConsentimientos('Debés aceptar los Términos y Condiciones para continuar.');
      return false;
    }
    if (!consentimientos.politicaDePrivacidad) {
      setErrorConsentimientos('Debés aceptar la Política de Privacidad para continuar.');
      return false;
    }
    setErrorConsentimientos(null);
    return true;
  }, [consentimientos]);

  const limpiarError = useCallback(() => setErrorConsentimientos(null), []);

  // ── Payload ───────────────────────────────────────────────────────────────

  const buildPayload = useCallback(() => ({
    terminosYCondiciones: consentimientos.terminosYCondiciones,
    politicaDePrivacidad: consentimientos.politicaDePrivacidad,
    marketing: consentimientos.marketing,
    versionTerminos: terminosYCondiciones.version,
    versionPolitica: politicaDePrivacidad.version,
  }), [consentimientos]);

  return {
    consentimientos,
    modalAbierto,
    errorConsentimientos,
    setTerminos,
    setPrivacidad,
    setMarketing,
    abrirTerminos,
    abrirPrivacidad,
    cerrarModal,
    validar,
    limpiarError,
    buildPayload,
  };
}
