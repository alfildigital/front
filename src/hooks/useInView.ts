import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Porcentaje del elemento que debe ser visible (default 0.15) */
  threshold?: number;
  /** Margen del root, ej. '0px 0px -10% 0px' (default) */
  rootMargin?: string;
}

/**
 * Detecta cuando un elemento entra en el viewport.
 *
 * - Se desconecta apenas el elemento es visible (animación única).
 * - Si `IntersectionObserver` no existe (jsdom/tests) devuelve `visible = true`.
 * - Si el usuario prefiere movimiento reducido, devuelve `visible = true`.
 *
 * @param options - Opciones de IntersectionObserver
 * @returns ref para el elemento y su estado de visibilidad
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (
      !element ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
