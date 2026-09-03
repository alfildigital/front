import type { ReactNode } from 'react';

// ===========================================================================
// INTERFAZ DE PROPIEDADES (PROPS)
// ===========================================================================

interface CardProps {
  /** Contenido interno que se renderizará dentro de la tarjeta */
  children: ReactNode;
  /** Clases CSS adicionales de Tailwind para personalizar o sobrescribir estilos */
  className?: string;
  /**
   * Elemento o etiqueta HTML dinámica para el contenedor base (ej: 'div', 'article', 'section').
   * Por defecto será 'div'.
   */
  as?: React.ElementType;
  /** Función callback que se ejecuta al hacer clic sobre la tarjeta */
  onClick?: () => void;
  /** URL opcional. Si se provee, la tarjeta actuará como un enlace exterior (`<a>`) */
  href?: string;
}

// ===========================================================================
// COMPONENTE PRINCIPAL
// ===========================================================================

export function Card({
  children,
  className = '',
  as: Tag = 'div', // Renombramos 'as' a 'Tag' (en mayúscula) para usarlo como componente React
  onClick,
  href,
}: CardProps) {
  // 1. Determina si la tarjeta debe comportarse como un elemento clickeable o navegable.
  // Transforma valores falsy/truthy a un booleano estricto (true/false).
  const isInteractive = !!onClick || !!href;

  // 2. Construcción dinámica del conjunto de clases CSS de Tailwind.
  const baseClasses = [
    // Estilos base de estructura, bordes, fondo y sombra (soporta modo oscuro)
    'rounded-xl border border-gray-200 bg-white shadow-sm',
    'dark:border-gray-700 dark:bg-gray-800/50',

    // Micro-interacciones visuales si la tarjeta es interactiva
    isInteractive
      ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
      : '',

    // Clases externas pasadas vía props
    className,
  ]
    .filter(Boolean) // Elimina cadenas vacías o falsy del arreglo
    .join(' '); // Une todas las clases con un espacio

  // 3. CASO A: Si se proporcionó un 'href', renderizamos la tarjeta como un enlace `<a>`
  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target="_blank" // Abre el enlace en una pestaña nueva
        rel="noopener noreferrer" // Seguridad: previene ataques de tabnabbing y no envía referrer
      >
        {children}
      </a>
    );
  }

  // 4. CASO B: Renderizado por defecto usando la etiqueta semántica dinámica (`div`, `article`, etc.)
  return (
    <Tag className={baseClasses} onClick={onClick}>
      {children}
    </Tag>
  );
}