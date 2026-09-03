/**
 * Type guards y validadores.
 * Permiten reducir el uso de 'as' y asegurar que los datos existen antes de usarlos.
 */

/** Verifica que un valor no es null ni undefined */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Verifica que un string no está vacío */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Verifica que un array no está vacío */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return value.length > 0;
}

/** Determina si una URL corresponde a un PDF */
export function isPdfUrl(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

/** Determina si una URL corresponde a una imagen */
export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url);
}
