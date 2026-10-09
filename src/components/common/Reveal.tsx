import type { ElementType, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

export interface RevealProps {
  children: ReactNode;
  /** Elemento a renderizar (default 'div') */
  as?: 'div' | 'header' | 'section' | 'figure' | 'h1' | 'h2';
  className?: string;
  /** Retraso de la animación: 1 | 2 | 3 (0.1s / 0.2s / 0.3s) */
  delay?: 1 | 2 | 3;
}

/**
 * Envuelve un título o imagen y lo revela con fade + desplazamiento
 * cuando entra en el viewport.
 */
export function Reveal({ children, as, className = '', delay }: RevealProps) {
  const { ref, visible } = useInView<HTMLElement>();

  const Tag = (as ?? 'div') as ElementType;

  const classes = [
    'reveal',
    delay ? `reveal-delay-${delay}` : '',
    visible ? 'reveal-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
