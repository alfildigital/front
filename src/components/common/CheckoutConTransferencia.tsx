// components/CheckoutConTransferencia.tsx
'use client'; // Quitalo si NO usás Next.js App Router

import { useState } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import type {
  DatosTransferencia,
  PaymentBrickSubmitParams,
} from '../types/mercadopago';

// ============================================================
// 🔧 CONFIGURACIÓN — COMPLETÁ ESTOS DATOS
// ============================================================

/** Datos de tu cuenta de Mercado Pago para transferencias manuales. */
const DATOS_TRANSFERENCIA: DatosTransferencia = {
  cvu: 'TU_CVU_DE_22_DIGITOS_AQUI',       // ej: '0000003100012345678901'
  alias: 'TU.ALIAS.AQUI',                  // ej: 'colegio.especial.mp'
  titular: 'NOMBRE DEL TITULAR',           // ej: 'Colegio Especial MSM'
  banco: 'Mercado Pago',
};

/** URL de tu backend que procesa el pago (creá este endpoint). */
const API_PROCESS_PAYMENT = '/api/process-payment';

// ============================================================

interface CheckoutConTransferenciaProps {
  /** Monto total a pagar en ARS. */
  monto: number;
  /** Callback opcional al finalizar el pago exitosamente. */
  onPagoExitoso?: (resultado: unknown) => void;
}

export const CheckoutConTransferencia = ({
  monto,
  onPagoExitoso,
}: CheckoutConTransferenciaProps) => {
  const [copiado, setCopiado] = useState<'cvu' | 'alias' | null>(null);
  const [enviando, setEnviando] = useState(false);

  // --- Manejo del submit del Payment Brick ---
  const handleSubmit = async (
    param: PaymentBrickSubmitParams
  ): Promise<void> => {
    setEnviando(true);
    try {
      const response = await fetch(API_PROCESS_PAYMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: unknown = await response.json();
      console.log('Resultado del pago:', result);
      onPagoExitoso?.(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al procesar el pago:', error.message);
      } else {
        console.error('Error desconocido al procesar el pago:', error);
      }
    } finally {
      setEnviando(false);
    }
  };

  // --- Manejo de errores del Brick ---
  const handleError = (error: unknown): void => {
    if (error instanceof Error) {
      console.error('Error en el Brick:', error.message);
    } else {
      console.error('Error desconocido en el Brick:', error);
    }
  };

  // --- Copiar al portapapeles ---
  const copiarAlPortapapeles = async (
    texto: string,
    campo: 'cvu' | 'alias'
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(campo);
      setTimeout(() => setCopiado(null), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al copiar:', error.message);
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      {/* 1. Payment Brick */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Pagar con tarjeta o transferencia
        </h2>

        <Payment
          initialization={{ amount: monto }}
          onSubmit={handleSubmit}
          onError={handleError}
          onReady={() => console.log('Payment Brick listo')}
        />

        {enviando && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Procesando pago...
          </p>
        )}
      </div>

      {/* 2. Datos de CVU/Alias para transferencia manual */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-3 text-sm font-semibold text-blue-800 dark:text-blue-300">
          ¿Preferís transferir manualmente?
        </h3>
        <p className="mb-3 text-xs text-blue-600 dark:text-blue-400">
          Usá estos datos desde tu homebanking o billetera virtual:
        </p>

        <div className="space-y-2 text-sm">
          <CampoCopiable
            label="CVU"
            valor={DATOS_TRANSFERENCIA.cvu}
            copiado={copiado === 'cvu'}
            onCopiar={() => copiarAlPortapapeles(DATOS_TRANSFERENCIA.cvu, 'cvu')}
          />
          <CampoCopiable
            label="Alias"
            valor={DATOS_TRANSFERENCIA.alias}
            copiado={copiado === 'alias'}
            onCopiar={() =>
              copiarAlPortapapeles(DATOS_TRANSFERENCIA.alias, 'alias')
            }
          />

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Titular:</span>{' '}
              {DATOS_TRANSFERENCIA.titular}
            </div>
            <div>
              <span className="font-medium">Banco:</span>{' '}
              {DATOS_TRANSFERENCIA.banco}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Subcomponente reutilizable
// ============================================================

interface CampoCopiableProps {
  label: string;
  valor: string;
  copiado: boolean;
  onCopiar: () => void;
}

const CampoCopiable = ({
  label,
  valor,
  copiado,
  onCopiar,
}: CampoCopiableProps) => (
  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-gray-800">
    <div className="min-w-0 flex-1">
      <span className="block text-xs text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="block truncate font-mono text-gray-800 dark:text-gray-100">
        {valor}
      </span>
    </div>
    <button
      type="button"
      onClick={onCopiar}
      className="ml-2 shrink-0 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {copiado ? '¡Copiado!' : 'Copiar'}
    </button>
  </div>
);