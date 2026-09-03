# Guía de integración con el Backend API

> **Audiencia:** Desarrolladores que necesiten conectar el frontend al backend real, cambiar la URL de la API, agregar nuevos endpoints, o entender el flujo completo de datos.

---

## Tabla de contenidos

1. [¿Dónde está la URL de la API?](#1-dónde-está-la-url-de-la-api)
2. [Archivos de entorno `.env`](#2-archivos-de-entorno-env)
3. [Flujo completo de datos: de la API al componente](#3-flujo-completo-de-datos-de-la-api-al-componente)
4. [Sistema de mocks (desarrollo sin backend)](#4-sistema-de-mocks-desarrollo-sin-backend)
5. [Cómo agregar un nuevo endpoint](#5-cómo-agregar-un-nuevo-endpoint)
6. [Referencia rápida de archivos involucrados](#6-referencia-rápida-de-archivos-involucrados)

---

## 1. ¿Dónde está la URL de la API?

La URL base del backend se configura **en un único lugar**: la variable de entorno `VITE_API_URL`.

Esa variable es leída en el archivo de configuración centralizado:

```
src/config/index.ts
```

```ts
export const config = {
  api: {
    url: import.meta.env.VITE_API_URL,   // ← AQUÍ se consume la variable
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  },
  ...
};
```

Ese valor es usado luego por el cliente HTTP:

```
src/api/client.ts
```

```ts
const apiClient = axios.create({
  baseURL: config.api.url,   // ← Axios usa este valor para TODAS las peticiones
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
```

> **Regla:** Nunca escribir `http://localhost:8000` directamente en el código.
> Siempre usar `config.api.url` o pasar por los servicios en `src/api/services/`.

---

## 2. Archivos de entorno `.env`

Vite carga automáticamente el archivo `.env` correspondiente al entorno activo.

### Tabla de archivos

| Archivo | Cuándo se usa | Comando |
|---|---|---|
| `.env.development` | Desarrollo local | `pnpm dev` |
| `.env.staging` | Staging pre-producción | `pnpm build --mode staging` |
| `.env.production` | Producción | `pnpm build` |
| `.env.example` | Referencia / plantilla | _(no se carga automáticamente)_ |
| `.env.local` | Override local personal | Cualquier entorno — **ignorado por git** |

### Variables disponibles

```dotenv
# URL base del backend PHP — sin barra final
VITE_API_URL=http://localhost:8000/api

# Timeout de peticiones HTTP en milisegundos
VITE_API_TIMEOUT=30000

# Número de WhatsApp sin el +
VITE_WHATSAPP_NUMBER=5491123456789

# "true" → usa mocks locales | "false" → llama al backend real
VITE_USE_MOCKS=true

# "true" → muestra errores en DevTools | "false" → silencioso
VITE_ENABLE_LOGS=true
```

### Valores por entorno

| Variable | development | staging | production |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api` | `https://staging.cpee.org.ar/api` | `https://cpee.org.ar/api` |
| `VITE_USE_MOCKS` | `true` | `false` | `false` |
| `VITE_ENABLE_LOGS` | `true` | `true` | `false` |
| `VITE_API_TIMEOUT` | `60000` (60 s) | `30000` (30 s) | `30000` (30 s) |

> **Para cambiar la URL del backend:** editar `VITE_API_URL` en el archivo `.env` del entorno
> correspondiente. No requiere tocar ningún archivo de código TypeScript.

---

## 3. Flujo completo de datos: de la API al componente

El flujo tiene **5 capas** bien definidas. Cada capa tiene una única responsabilidad.

```
┌─────────────────────────────────────────────────────────────────────┐
│  COMPONENTE / PÁGINA                                                │
│  src/pages/ObrasSociales/index.tsx                                  │
│  Llama al hook y renderiza los datos                                │
└────────────────────────┬────────────────────────────────────────────┘
                         │ const { data, isPending, isError } = useObrasSociales()
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CUSTOM HOOK (React Query)                                          │
│  src/hooks/queries/useObrasSociales.ts                              │
│  Gestiona caché, estados (isPending/isError) y reintentos           │
└────────────────────────┬────────────────────────────────────────────┘
                         │ queryFn: service.getAll
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SERVICIO                                                           │
│  src/api/services/obrasSocialesService.ts        (real)             │
│  src/mocks/services/mockObrasSocialesService.ts  (mock)             │
│  Encapsula la URL y extrae el payload de la respuesta               │
└────────────────────────┬────────────────────────────────────────────┘
                         │ apiClient.get('/obras-sociales')
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CLIENTE HTTP (Axios)                                               │
│  src/api/client.ts                                                  │
│  Agrega baseURL, headers, timeout e intercepta errores              │
└────────────────────────┬────────────────────────────────────────────┘
                         │ GET https://cpee.org.ar/api/obras-sociales
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND PHP                                                        │
│  Endpoint: GET /api/obras-sociales                                  │
│  Responde: { "data": ObraSocial[], ... }                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Explicación de cada capa

#### Capa 1 — Backend PHP

El servidor responde con un JSON con esta estructura:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "OSDE",
      "logo": null,
      "descripcion": "...",
      "telefono": "0800-555-6733",
      "email": "atencion@osde.com.ar",
      "sitioWeb": "https://www.osde.com.ar"
    }
  ]
}
```

El tipo de cada entidad está definido en `src/types/index.ts` y debe coincidir exactamente
con los campos que devuelve el backend. Si el backend agrega un campo, se actualiza primero
el tipo, luego el servicio.

---

#### Capa 2 — Cliente HTTP (`src/api/client.ts`)

Instancia de Axios compartida por todos los servicios. Responsabilidades:

- Prepend la `baseURL` (`VITE_API_URL`) a todas las URLs relativas
- Agrega headers `Content-Type: application/json` y `Accept: application/json`
- Aplica el `timeout` configurado
- **Interceptor de errores:** normaliza cualquier error 4xx/5xx en un objeto `ApiError`
  estándar con `message` y `status`. Si `VITE_ENABLE_LOGS=true`, lo imprime en DevTools.

---

#### Capa 3 — Servicio (`src/api/services/`)

Cada recurso tiene su propio archivo de servicio. Responsabilidad única:
**conocer la URL del endpoint y extraer el payload**.

```ts
// src/api/services/obrasSocialesService.ts
getAll: async (): Promise<ObraSocial[]> => {
  const { data } = await apiClient.get<ApiResponse<ObraSocial[]>>(ENDPOINTS.obrasSociales.list);
  return data.data;  // ← extrae el array del wrapper { data: [...] }
}
```

Los endpoints están centralizados en `src/api/endpoints.ts`:

```ts
export const ENDPOINTS = {
  obrasSociales: { list: '/obras-sociales' },
  tramites:      { list: '/tramites' },
  noticias:      { list: '/noticias', detail: (id) => `/noticias/${id}` },
  matriculados:  { list: '/matriculados', pago: '/matriculados/pago', honorarios: '/honorarios' },
  alquileres:    { list: '/alquileres' },
  boletin:       { list: '/boletin-oficial' },
  instagram:     { list: '/instagram' },
};
```

> **Para cambiar la URL de un endpoint:** editar solo `src/api/endpoints.ts`.

---

#### Capa 4 — Custom Hook (`src/hooks/queries/`)

Usa React Query (`@tanstack/react-query`). Responsabilidades:

- **Caché:** guarda el resultado con una clave única (`queryKey`). Si ya hay datos frescos,
  no hace otra petición HTTP.
- **Estados reactivos:** expone `isPending`, `isError`, `isSuccess`, `data`.
- **Reintentos:** ante un error, reintenta automáticamente hasta 2 veces.
- **Selector mock/real:** decide qué servicio usar según `config.mocks.enabled`.

```ts
// src/hooks/queries/useObrasSociales.ts
const service = config.mocks.enabled ? mockObrasSocialesService : obrasSocialesService;

export function useObrasSociales() {
  return useQuery<ObraSocial[]>({
    queryKey: [QUERY_KEYS.obrasSociales],  // 'obras-sociales'
    queryFn: service.getAll,
  });
}
```

**Configuración global de React Query** (en `src/main.tsx`):

| Parámetro | Valor | Significado |
|---|---|---|
| `staleTime` | 5 min | Los datos son frescos 5 minutos. Sin re-fetch durante ese tiempo. |
| `gcTime` | 10 min | El caché se elimina si no hay componentes usándolo por 10 min. |
| `retry` | 2 | Reintenta 2 veces antes de marcar `isError = true`. |
| `refetchOnWindowFocus` | `false` | No recarga datos automáticamente al volver a la pestaña. |

---

#### Capa 5 — Componente / Página

Consume el hook y decide qué renderizar según el estado:

```tsx
const { data, isPending, isError, refetch } = useObrasSociales();

// Estado A: cargando
if (isPending) return <CardSkeletonGrid count={4} />;

// Estado B: error
if (isError) return <ErrorBanner message="..." onRetry={refetch} />;

// Estado C: sin datos
if (!data?.length) return <EmptyState title="Sin obras sociales" />;

// Estado D: éxito
return <Grid data={data} />;
```

---

## 4. Sistema de mocks (desarrollo sin backend)

Cuando `VITE_USE_MOCKS=true` en `.env.development`, **ninguna petición HTTP sale del
navegador**. Los datos provienen de archivos locales en `src/mocks/`.

### Estructura de mocks

```
src/mocks/
├── data/                        ← Arrays TypeScript con datos estáticos
│   ├── obrasSociales.ts         ← 12 obras sociales de ejemplo
│   ├── tramites.ts              ← 4 trámites de ejemplo
│   ├── noticias.ts
│   ├── matriculados.ts
│   ├── alquileres.ts
│   ├── boletin.ts
│   └── instagram.ts
└── services/                    ← Implementaciones mock con delay simulado
    ├── mockObrasSocialesService.ts
    ├── mockTramitesService.ts
    └── ...
```

### Selector en el hook

```ts
const service = config.mocks.enabled
  ? mockObrasSocialesService   // ← devuelve datos locales con delay de 600ms
  : obrasSocialesService;      // ← hace GET real al backend
```

### Pasar de mocks a la API real

1. Editar `.env.development`:
   ```dotenv
   VITE_USE_MOCKS=false
   VITE_API_URL=http://localhost:8000/api
   ```
2. Levantar el backend PHP:
   ```bash
   php -S localhost:8000 -t public
   ```
3. Reiniciar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

---

## 5. Cómo agregar un nuevo endpoint

Ejemplo: agregar `GET /api/eventos`.

### Paso 1 — Tipo en `src/types/index.ts`

```ts
export interface Evento {
  id: number;
  titulo: string;
  fecha: string;      // ISO 8601
  lugar: string | null;
}
```

### Paso 2 — URL en `src/api/endpoints.ts`

```ts
eventos: {
  list: '/eventos',
  detail: (id: number) => `/eventos/${id}`,
},
```

### Paso 3 — Clave de caché en `src/config/constants.ts`

```ts
export const QUERY_KEYS = {
  // ...existentes...
  eventos: 'eventos',
};
```

### Paso 4 — Servicio real en `src/api/services/eventosService.ts`

```ts
import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Evento } from '@/types';

export const eventosService = {
  getAll: async (): Promise<Evento[]> => {
    const { data } = await apiClient.get<ApiResponse<Evento[]>>(ENDPOINTS.eventos.list);
    return data.data;
  },
};
```

### Paso 5 — Datos mock en `src/mocks/data/eventos.ts`

```ts
import type { Evento } from '@/types';

export const mockEventos: Evento[] = [
  { id: 1, titulo: 'Asamblea Anual', fecha: '2026-10-15T18:00:00Z', lugar: 'Sede Central' },
  { id: 2, titulo: 'Capacitación', fecha: '2026-11-03T09:00:00Z', lugar: null },
];
```

### Paso 6 — Mock service en `src/mocks/services/mockEventosService.ts`

```ts
import { mockEventos } from '@/mocks/data/eventos';
import type { Evento } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockEventosService = {
  getAll: async (): Promise<Evento[]> => {
    await delay(500);
    return mockEventos;
  },
};
```

### Paso 7 — Custom hook en `src/hooks/queries/useEventos.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { eventosService } from '@/api/services/eventosService';
import { mockEventosService } from '@/mocks/services/mockEventosService';
import type { Evento } from '@/types';

const service = config.mocks.enabled ? mockEventosService : eventosService;

export function useEventos() {
  return useQuery<Evento[]>({
    queryKey: [QUERY_KEYS.eventos],
    queryFn: service.getAll,
  });
}
```

### Paso 8 — Página en `src/pages/Eventos/index.tsx`

```tsx
import { useEventos } from '@/hooks/queries/useEventos';

export default function EventosPage() {
  const { data, isPending, isError, refetch } = useEventos();
  // ... renderizado con Layout, Helmet, CardSkeletonGrid, ErrorBanner, EmptyState
}
```

### Paso 9 — Ruta en `src/router/index.tsx`

```ts
const EventosPage = lazy(() => import('@/pages/Eventos'));

// dentro del array de rutas:
{ path: '/eventos', element: withSuspense(EventosPage) },
```

---

## 6. Referencia rápida de archivos involucrados

| Archivo | Responsabilidad |
|---|---|
| `.env.development` | URL de la API para `pnpm dev` |
| `.env.production` | URL de la API para `pnpm build` |
| `.env.staging` | URL de la API para staging |
| `.env.example` | Plantilla de referencia con todas las variables documentadas |
| `src/config/index.ts` | Lee las variables `.env` y las expone como objeto tipado `config` |
| `src/api/client.ts` | Instancia de Axios con baseURL, timeout e interceptor de errores |
| `src/api/endpoints.ts` | Centraliza todas las URLs de endpoints |
| `src/api/services/*.ts` | Un archivo por recurso; hace el GET y extrae `data.data` |
| `src/mocks/data/*.ts` | Datos estáticos para desarrollo sin backend |
| `src/mocks/services/*.ts` | Implementaciones mock con delay simulado |
| `src/hooks/queries/*.ts` | Custom hooks con React Query; eligen real vs mock |
| `src/config/constants.ts` | `QUERY_KEYS` — claves de caché de React Query |
| `src/types/index.ts` | Interfaces TypeScript de cada entidad del dominio |
| `src/main.tsx` | Configuración global de React Query (staleTime, retry, etc.) |

### Diagrama de dependencias entre archivos

```
.env.*
  └─► src/config/index.ts         (config)
        └─► src/api/client.ts     (apiClient con baseURL)
              └─► src/api/endpoints.ts        (URLs de endpoints)
                    └─► src/api/services/*.ts (lógica HTTP por recurso)
                          └─► src/hooks/queries/*.ts  (React Query + caché)
                                └─► src/pages/**/*.tsx (componentes UI)

src/mocks/data/*.ts
  └─► src/mocks/services/*.ts    (servicios mock con delay)
        └─► src/hooks/queries/*.ts (mismos hooks, distintos servicios)
```
