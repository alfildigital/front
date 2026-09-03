# Guía: cómo crear una Card paso a paso

Este proyecto ya tiene un componente `Card` genérico y reutilizable en
`src/components/common/Card.tsx`. Esta guía explica su estructura, cómo
usarlo y cómo construir una card específica encima de él.

---

## El componente base: `Card`

```ts
// src/components/common/Card.tsx

interface CardProps {
  children: ReactNode;     // contenido interno
  className?: string;      // clases Tailwind extra
  as?: React.ElementType;  // etiqueta HTML: 'div', 'article', 'section'…
  onClick?: () => void;    // hace la card clickeable
  href?: string;           // hace la card un enlace <a>
}
```

**Comportamiento automático:**
- Si recibe `href` → se renderiza como `<a target="_blank">` (enlace externo)
- Si recibe `onClick` → agrega estilos hover + cursor pointer
- Si no recibe ninguno → es decorativa, sin interacción

---

## Paso 1 — Definir el tipo de dato que va a mostrar la card

Antes de crear el componente visual, hay que saber qué datos va a recibir.
Los tipos están en `src/types/index.ts`.

**Ejemplo: queremos mostrar una obra social.**

```ts
// src/types/index.ts  (ya existe)
export interface ObraSocial {
  id: number;
  nombre: string;
  logo: string | null;
  descripcion: string | null;
  telefono: string | null;
  email: string | null;
  sitioWeb: string | null;
}
```

Si la entidad que querés mostrar **no existe**, agregala ahí con solo
las propiedades que la UI necesita. Marcala con `// [PROVISIONAL]` si
el contrato con el backend todavía no está definido.

---

## Paso 2 — Crear el archivo del componente

Dentro de `src/components/` hay tres carpetas:

| Carpeta | Qué va ahí |
|---|---|
| `common/` | Cards genéricas, reutilizables en varios módulos |
| `sections/` | Secciones completas de una página (héroe, grid de cards, etc.) |
| `layout/` | Estructura global (Navbar, Footer, Layout) |

Para una card específica de un módulo, podés ponerla en la propia carpeta
de la página o en `common/` si la reutilizás en varias partes.

**Crear el archivo:**

```
src/components/common/ObraSocialCard.tsx    ← si la usás en varios lados
    o
src/pages/ObrasSociales/ObraSocialCard.tsx  ← si solo la usa esa página
```

---

## Paso 3 — Escribir el componente

### Estructura mínima (solo texto)

```tsx
import { Card } from '@/components/common/Card';
import type { ObraSocial } from '@/types';

interface ObraSocialCardProps {
  obra: ObraSocial;
}

export function ObraSocialCard({ obra }: ObraSocialCardProps) {
  return (
    <Card as="article">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {obra.nombre}
        </h2>

        {obra.descripcion && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {obra.descripcion}
          </p>
        )}
      </div>
    </Card>
  );
}
```

**Reglas de renderizado condicional:**
- `{valor && <Elemento />}` → renderiza solo si `valor` es truthy
- `{valor ?? 'texto alternativo'}` → usa texto alternativo si `valor` es null/undefined
- `{valor ? <A /> : <B />}` → ternario, elige entre dos opciones

---

### Estructura completa (con imagen, datos de contacto y enlace)

```tsx
import { Phone, Mail, Globe } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { ObraSocial } from '@/types';

interface ObraSocialCardProps {
  obra: ObraSocial;
}

export function ObraSocialCard({ obra }: ObraSocialCardProps) {
  return (
    // href hace que toda la card sea un enlace externo
    // Quitá href si no querés que sea clickeable
    <Card as="article" href={obra.sitioWeb ?? undefined}>
      <div className="flex flex-col gap-4 p-5">

        {/* ── CABECERA ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {obra.logo ? (
            <img
              src={obra.logo}
              alt={`Logo de ${obra.nombre}`}
              className="h-12 w-12 rounded-lg object-contain"
            />
          ) : (
            // Placeholder cuando no hay logo
            <div className="flex h-12 w-12 items-center justify-center
                            rounded-lg bg-primary-100 text-primary-600
                            dark:bg-primary-900/30 dark:text-primary-400">
              <Globe className="h-6 w-6" aria-hidden="true" />
            </div>
          )}

          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {obra.nombre}
          </h2>
        </div>

        {/* ── DESCRIPCIÓN ─────────────────────────────────────── */}
        {obra.descripcion && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {obra.descripcion}
          </p>
        )}

        {/* ── DATOS DE CONTACTO ────────────────────────────────── */}
        <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
          {obra.telefono && (
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {obra.telefono}
            </li>
          )}
          {obra.email && (
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {obra.email}
            </li>
          )}
        </ul>

      </div>
    </Card>
  );
}
```

---

## Paso 4 — Usar la card en una página

Las páginas están en `src/pages/`. Buscá la que corresponde o creá una nueva.

```tsx
// src/pages/ObrasSociales/index.tsx  (fragmento relevante)

import { ObraSocialCard } from '@/components/common/ObraSocialCard';
import { useObrasSociales } from '@/hooks/queries/useObrasSociales';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';

export default function ObrasSocialesPage() {
  const { data, isPending, isError, refetch } = useObrasSociales();

  return (
    <div>
      {/* 1. Cargando */}
      {isPending && <CardSkeletonGrid count={4} />}

      {/* 2. Error */}
      {isError && (
        <ErrorBanner
          message="No se pudieron cargar las obras sociales."
          onRetry={refetch}
        />
      )}

      {/* 3. Sin datos */}
      {!isPending && !isError && data?.length === 0 && (
        <EmptyState
          title="Sin obras sociales"
          description="No hay obras sociales disponibles por el momento."
        />
      )}

      {/* 4. Datos disponibles */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((obra) => (
            <ObraSocialCard key={obra.id} obra={obra} />
          ))}
        </div>
      )}
    </div>
  );
}
```

Los cuatro estados (`isPending`, `isError`, vacío, con datos) son
**obligatorios** en cada página según la arquitectura del proyecto.

---

## Paso 5 — Verificar en el navegador

1. Correr `pnpm dev`
2. Navegar a la ruta correspondiente
3. Con `VITE_USE_MOCKS=true` deberías ver los datos mock en ~600ms
4. Para ver el estado de carga: en DevTools → Network → agregar throttling "Slow 3G"
5. Para ver el estado de error: cambiar la URL del mock a algo que tire error,
   o poner `VITE_USE_MOCKS=false` sin backend levantado

---

## Resumen: estructura de una card en este proyecto

```
ObraSocialCard.tsx
├─ Props: { obra: ObraSocial }           ← tipo de src/types/index.ts
├─ Usa: <Card> de common/Card.tsx        ← estilos base, hover, href
└─ Contenido:
     ├─ Imagen / placeholder condicional
     ├─ Título (siempre)
     ├─ Descripción (si existe)
     └─ Contacto (teléfono, email, si existen)

Página que la usa:
├─ Hook: useObrasSociales()              ← React Query + service
├─ Estado isPending → <CardSkeletonGrid>
├─ Estado isError   → <ErrorBanner>
├─ Estado vacío     → <EmptyState>
└─ Estado con datos → .map(obra => <ObraSocialCard>)
```

---

## Estilos Tailwind de referencia para cards

| Clase | Qué hace |
|---|---|
| `rounded-xl` | Bordes redondeados grandes |
| `border border-gray-200` | Borde sutil gris |
| `bg-white` | Fondo blanco |
| `shadow-sm` | Sombra suave |
| `dark:border-gray-700 dark:bg-gray-800/50` | Equivalentes en modo oscuro |
| `p-5` / `p-6` | Padding interno |
| `flex flex-col gap-4` | Columna con separación entre elementos |
| `text-sm text-gray-600` | Texto secundario pequeño |
| `font-semibold text-gray-900` | Título principal |
| `hover:shadow-md hover:-translate-y-0.5` | Efecto hover (ya incluido por `<Card>`) |

