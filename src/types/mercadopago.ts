// types/mercadopago.ts

/** Datos de la cuenta para transferencia manual (los cargás vos). */
export interface DatosTransferencia {
  cvu: string;
  alias: string;
  titular: string;
  banco: string;
}

/**
 * Parámetro que devuelve el onSubmit del Payment Brick.
 * El SDK no lo exporta públicamente, así que lo definimos a mano.
 */
export interface PaymentBrickSubmitParams {
  selectedPaymentMethod: string;
  formData: Record<string, unknown>;
}