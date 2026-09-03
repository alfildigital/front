# Arquitectura del Frontend

## Visión general

SPA institucional pública construida con Vite + React + TypeScript.  
Sin autenticación. Consume una API REST PHP.

---

## Flujo de datos

```
PAGE
  ↓
HOOK (React Query)
  ↓
SERVICE (llamada HTTP)
  ↓
AXIOS CLIENT
  ↓
API PHP
```

---

## Capas

### `src/api/`
- **`client.ts`** — Instancia de Axios compartida. Configura baseURL, timeout, headers e interceptor de errores.
- **`endpoints.ts`** — Constantes de URLs. No hay strings de URL fuera de este archivo.
- **`services/`** — Un archivo por módulo. Cada servicio realiza la llamada HTTP y retorna el tipo correspondiente.

### `src/hooks/`
- **`useDebounce.ts`** — Hook genérico de debounce.
- **`queries/`** — Un hook por módulo. Cada hook usa React Query, define el `queryKey` y llama al servicio.

### `src/types/`
- **`api.ts`** — Tipos base: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`.
- **`index.ts`** — Interfaces de dominio. Representan el contrato real con el backend PHP.

### `src/config/`
- **`index.ts`** — Acceso centralizado a variables de entorno. Las demás capas no usan `import.meta.env` directamente.
- **`constants.ts`** — Constantes de aplicación (SITE_NAME, QUERY_KEYS, etc.).

### `src/mocks/`
- **`data/`** — Datos ficticios tipados. Respetan las mismas interfaces que la API real.
- **`services/`** — Servicios mock con delay simulado. Se activan con `VITE_USE_MOCKS=true`.

### `src/components/`
- **`common/`** — Componentes reutilizables: Skeleton, EmptyState, ErrorBanner, Spinner, Card.
- **`layout/`** — Navbar, Footer, Layout.
- **`sections/`** — Secciones de la Home: InstagramCarousel, NoticiasPreview, TramitesDestacados.

### `src/pages/`
- Una carpeta por módulo.
- Cada página es responsable de la composición visual, usa hooks y renderiza componentes.

### `src/router/`
- `index.tsx` — Router con `createBrowserRouter`. Todas las páginas se cargan con `lazy()`.

### `src/utils/`
- `formatters.ts` — Funciones puras de formato (fechas, montos, textos).
- `validators.ts` — Type guards y comprobaciones de tipos.

---

## Modo sustentable (dark mode)

El modo oscuro se llama "modo sustentable" en la UI.  
Se activa con el ícono 🌿 en la Navbar.  
Se persiste en `localStorage` bajo la clave `theme`.  
Tailwind usa `darkMode: 'class'`.

---

## Mocks

Controlados por `VITE_USE_MOCKS=true` (activo por defecto en desarrollo).  
Los hooks eligen el servicio real o el mock en el momento de importación.  
Para desactivarlos: cambiar a `VITE_USE_MOCKS=false` en `.env.development`.
