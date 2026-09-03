# ENV, API y flujo de datos — CPEE Frontend

---

## 1. ¿Por qué existen los archivos `.env`?

### El problema sin `.env`

Sin los archivos `.env`, Vite no sabe cómo arrancar la aplicación porque el
código fuente **no tiene ningún valor hardcodeado**. Toda la configuración
—la URL del backend, si usar mocks o API real, el número de WhatsApp— se
lee en tiempo de ejecución desde variables de entorno.

El archivo central que las consume es `src/config/index.ts`:

```ts
export const config = {
  api: {
    url:     import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  },
  mocks: {
    enabled: import.meta.env.VITE_USE_MOCKS === 'true',
  },
  // ...
} as const;
```

Si `VITE_USE_MOCKS` no existe o no está definida como `'true'`,
`config.mocks.enabled` vale `false`.

### Por qué sin `.env` no se ven los mocks

Dentro de cada hook (por ejemplo `src/hooks/queries/useObrasSociales.ts`):

```ts
const service = config.mocks.enabled
  ? mockObrasSocialesService   // datos locales de src/mocks/data/
  : obrasSocialesService;      // llama a la API PHP real
```

Si `config.mocks.enabled` es `false` (porque `VITE_USE_MOCKS` no fue
definida o vale cualquier cosa distinta de `'true'`), el hook intenta
conectarse al backend real. Si el backend no está levantado, la petición
falla → se muestra el `ErrorBanner` o la pantalla queda en carga indefinida.

**Moraleja:** sin el `.env` con `VITE_USE_MOCKS=true`, la app intenta
conectarse a una API que no existe → no se ven datos.

### El prefijo `VITE_` es obligatorio

Vite, por seguridad, **solo expone** al navegador las variables que
empiezan con `VITE_`. Las demás permanecen en el servidor de Node y son
inaccesibles para el cliente.

---

## 2. Archivos `.env` disponibles y cuándo se usan

| Archivo | Comando que lo activa | Estado por defecto |
|---|---|---|
| `.env.development` | `pnpm dev` | Mocks ON |
| `.env.production` | `pnpm build` | Mocks OFF |
| `.env.staging` | `pnpm build --mode staging` | Mocks OFF, logs ON |
| `.env.local` | Todos (overrides) | — |
| `.env.example` | Nunca (solo documentación) | — |

**Prioridad de carga de Vite** (de mayor a menor):

```
.env.local
  ↓
.env.[mode].local      (.env.development.local, .env.production.local…)
  ↓
.env.[mode]            (.env.development, .env.production…)
  ↓
.env
```

Si la misma variable aparece en varios archivos, gana la que está más arriba.

---

## 3. Paso a paso: cómo se conecta la app a la API

### Paso 0 — Arranque de la app (`main.tsx`)

```
index.html
  └─► main.tsx
        ├─ QueryClientProvider  ← React Query (caché, reintentos, staleTime)
        ├─ HelmetProvider       ← SEO dinámico
        └─ <App />              ← Router principal
```

React Query se configura aquí con valores globales:

- `staleTime: 5 min` → los datos no se refrescan durante 5 minutos
- `gcTime: 10 min` → los datos permanecen en caché 10 minutos
- `retry: 2` → reintenta 2 veces ante un error de red

---

### Paso 1 — La página se monta

Cuando el usuario navega a `/obras-sociales`,
`src/pages/ObrasSociales/index.tsx` se renderiza.
Lo primero que hace es ejecutar el hook:

```ts
const { data, isPending, isError, refetch } = useObrasSociales();
```

---

### Paso 2 — El hook decide: ¿mock o API real?

En `src/hooks/queries/useObrasSociales.ts`:

```ts
// Lee VITE_USE_MOCKS desde .env a través de config/index.ts
const service = config.mocks.enabled
  ? mockObrasSocialesService   // true  → datos de src/mocks/data/obrasSociales.ts
  : obrasSocialesService;      // false → Axios → GET /api/obras-sociales

export function useObrasSociales() {
  return useQuery<ObraSocial[]>({
    queryKey: ['obras-sociales'],
    queryFn: service.getAll,
  });
}
```

---

### Paso 3A — Camino mock (`VITE_USE_MOCKS=true`)

```
useObrasSociales()
  └─► mockObrasSocialesService.getAll()
        └─► await delay(600ms)           ← simula latencia HTTP
              └─► return mockObrasSociales   ← array local de obrasSociales.ts
```

Los datos nunca salen del navegador.

---

### Paso 3B — Camino API real (`VITE_USE_MOCKS=false`)

```
useObrasSociales()
  └─► obrasSocialesService.getAll()
        └─► apiClient.get('/obras-sociales')
              │
              ├─ apiClient = axios.create({
              │     baseURL: config.api.url,   ← VITE_API_URL del .env
              │     timeout: config.api.timeout ← VITE_API_TIMEOUT del .env
              │  })
              │
              └─► HTTP GET https://cpee.org.ar/api/obras-sociales
                    │
                    ├─ Respuesta exitosa:
                    │     { "success": true, "data": [ {...}, {...} ] }
                    │     └─► return data.data   (el array de ObraSocial[])
                    │
                    └─ Error:
                          Interceptor de Axios normaliza a ApiError
                          { message, status, code? }
```

---

### Paso 4 — La página gestiona los estados

```tsx
// Estado 1: cargando
{isPending && <CardSkeletonGrid count={4} />}

// Estado 2: error
{isError && <ErrorBanner message="..." onRetry={refetch} />}

// Estado 3: sin datos
{!isPending && !isError && data?.length === 0 && <EmptyState />}

// Estado 4: datos disponibles → renderiza las tarjetas
{paginatedItems.map((os) => <ObraSocialCard key={os.id} obra={os} />)}
```

---

### Resumen visual del flujo completo

```
pnpm dev / pnpm build
      │
      ▼
Vite lee .env.[mode]
  VITE_API_URL     → config.api.url
  VITE_USE_MOCKS   → config.mocks.enabled
  VITE_API_TIMEOUT → config.api.timeout
      │
      ▼
main.tsx arranca la app
  QueryClientProvider (caché global)
      │
      ▼
Usuario navega a /obras-sociales
      │
      ▼
useObrasSociales()
      │
      ├─ config.mocks.enabled = true ──► mockService → datos locales (ms)
      │
      └─ config.mocks.enabled = false ─► apiService → Axios → PHP API
                                                           │
                                                     Interceptor:
                                                     OK  → data.data
                                                     ERR → ApiError
      │
      ▼
React Query entrega: { data, isPending, isError, refetch }
      │
      ▼
Página renderiza según estado:
  isPending → Skeleton
  isError   → ErrorBanner
  data = [] → EmptyState
  data > 0  → Grid de Cards + Paginación
```

---

## 4. Cómo conectar con la API externa PHP

### Opción A: solo para desarrollo local (sin tocar archivos versionados)

Crear un `.env.local` (Git lo ignora automáticamente):

```env
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:8000/api
VITE_ENABLE_LOGS=true
VITE_API_TIMEOUT=60000
```

Luego `pnpm dev` y la app ya habla con el backend PHP local.

### Opción B: para producción (`pnpm build`)

Editar `.env.production` con los valores reales:

```env
VITE_API_URL=https://cpee.org.ar/api
VITE_USE_MOCKS=false
VITE_ENABLE_LOGS=false
VITE_API_TIMEOUT=30000
VITE_WHATSAPP_NUMBER=5491123456789
```

### Lo que el backend PHP debe responder

Todos los servicios esperan este wrapper JSON:

```json
{
  "success": true,
  "data": [ ... ]
}
```

El interceptor de Axios lee `response.data.data` y lo entrega al hook.
Si el backend responde sin el wrapper (array directo), hay que ajustar
únicamente los archivos en `src/api/services/` → ninguna page ni componente
necesita cambios.

### CORS: el backend debe permitir el origen del frontend

```php
// En el backend PHP (middleware o index.php):
header('Access-Control-Allow-Origin: http://localhost:5173'); // dev
// header('Access-Control-Allow-Origin: https://cpee.org.ar'); // prod
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

---

## 5. Qué pasa si falta una variable de entorno

| Variable faltante | Consecuencia |
|---|---|
| `VITE_API_URL` | `config.api.url` es `undefined` → Axios usa `/` como baseURL → todas las peticiones fallan |
| `VITE_USE_MOCKS` | `config.mocks.enabled` es `false` → intenta conectarse al backend real |
| `VITE_API_TIMEOUT` | El código tiene fallback `?? 30000` → usa 30 segundos |
| `VITE_ENABLE_LOGS` | `config.logs.enabled` es `false` → modo silencioso (sin logs en consola) |
| `VITE_WHATSAPP_NUMBER` | El enlace `wa.me/undefined` queda roto |

