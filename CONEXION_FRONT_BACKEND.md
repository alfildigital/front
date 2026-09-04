# Conexión Frontend ↔ Backend — CPEE

> **Audiencia:** Desarrolladores que necesiten conectar la SPA pública
> (`cpee_front`, React/Vite) con la API REST del backend (`cpee`, PHP puro).
>
> **Estado:** Documento de **análisis + plan de conexión**. Describe cómo se
> conectan los dos proyectos **hoy**, qué discrepancias existen y qué hay que
> hacer paso a paso. **No ejecuta cambios por sí solo**: cada paso debe
> confirmarse antes de implementarse.

---

## Tabla de contenidos

1. [Resumen arquitectónico](#1-resumen-arquitectónico)
2. [Cómo se conectan hoy (flujo real)](#2-cómo-se-conectan-hoy-flujo-real)
3. [Dónde se configura la conexión](#3-dónde-se-configura-la-conexión)
4. [Discrepancias detectadas (crítico)](#4-discrepancias-detectadas-crítico)
5. [Plan de conexión paso a paso](#5-plan-de-conexión-paso-a-paso)
6. [Autenticación Bearer](#6-autenticación-bearer)
7. [CORS](#7-cors)
8. [Glosario de archivos involucrados](#8-glosario-de-archivos-involucrados)

---

## 1. Resumen arquitectónico

```
┌─────────────────────────────┐          ┌──────────────────────────────┐
│  cpee_front  (SPA React)    │   HTTP   │  cpee  (Backend PHP, API)    │
│  Vite + React + TS + Axios  │ ───────► │  frameworkless, PostgreSQL   │
└─────────────────────────────┘          └──────────────────────────────┘
        VITE_API_URL       Authorization: Bearer <API_API_KEY>
        (baseURL Axios)     CORS: Access-Control-Allow-Origin: *
```

- **Frontend (`cpee_front/`)**: SPA pública, sin autenticación de usuarios.
  Toda la comunicación con el backend pasa por un único cliente Axios.
- **Backend (`cpee/`)**: API REST bajo `/cpee/api/v1`, `stateless` (sin sesión),
  protegida por un **token Bearer** global. Comparte codebase con el panel
  administrativo (MVC clásico `/cpee/...`), pero la API es independiente.

---

## 2. Cómo se conectan hoy (flujo real)

La capa de conexión es **Axios**. El flujo real cuando `VITE_USE_MOCKS=false`:

```
Hook de React Query (src/hooks/queries/*.ts)
   │  elige service real o mock según config.mocks.enabled
   ▼
Service (src/api/services/*.ts)
   │  apiClient.get(ENDPOINTS.recurso.list)
   ▼
Cliente Axios (src/api/client.ts)
   │  baseURL = config.api.url  (= VITE_API_URL del .env)
   │  headers: Content-Type, Accept   ←  ⚠️ NO envía Authorization
   ▼
Backend (public/index.php)
   │  ruteo /api/v1 → App\Controllers\Api\*Controller
   ▼
Az ApiController::success() → { success, data, meta }
   ▼
Frontend lee response.data.data  (extrae el array del wrapper)
```

> **Contrato de respuesta esperado por el frontend:** `{ data: [...] }`
> (definido en `src/types/api.ts` como `ApiResponse<T>`).
> El backend responde `{ success, data, meta }`, que es **compatible** con ese
> wrapper: `data` está presente en ambos.

---

## 3. Dónde se configura la conexión

### 3.1 URL base — `VITE_API_URL`

Se lee en `src/config/index.ts:7` y se usa como `baseURL` de Axios en
`src/api/client.ts:19`.

Valores posibles (ver `.env` del frontend):

| Entorno | `VITE_API_URL` |
|---|---|
| Desarrollo local (backend en Apache) | `http://localhost/cpee/api/v1` |
| PHP built-in server | `http://localhost:8000/api` |
| Producción | `https://cpee.com.ar/api/v1` |

> **Importante:** `VITE_API_URL` ya termina en `/api/v1`. Los endpoints del
> frontend (`/obras-sociales`, `/profesionales`, etc.) se concatenan después.

### 3.2 Endpoints — `src/api/endpoints.ts`

Centraliza las rutas relativas que se concatenan a la `baseURL`.

### 3.3 Token — `VITE_APP_API_KEY`

Variable presente en el `.env` del frontend pero **todavía sin uso** en el
cliente Axios. Es el valor que debe enviarse como `Authorization: Bearer ...`
(ver [sección 6](#6-autenticación-bearer)).

### 3.4 Modo mocks — `VITE_USE_MOCKS`

Controla si la app usa datos locales (`src/mocks/`) o llama al backend real.
Selector en cada hook, por ejemplo `src/hooks/queries/useObrasSociales.ts`:

```ts
const service = config.mocks.enabled ? mockObrasSocialesService : obrasSocialesService;
```

---

## 4. Discrepancias detectadas (crítico)

> Antes de conectar de verdad hay **4 problemas** que impiden que el frontend
> funcione contra el backend real. Detectados leyendo ambos repositorios.

### 4.1 Mapeo de endpoints: nombres distintos

| Recurso (página front) | Endpoint que espera el front | Endpoint real en backend | Estado |
|---|---|---|---|
| Noticias | `/noticias` | `/novedades` | ❌ distinto |
| Matriculados | `/users` | `/profesionales` | ❌ distinto |
| Boletín oficial | `/boletin-oficial` | `/boletines-oficiales` | ❌ distinto |
| Obras sociales | `/obras-sociales` | `/obras-sociales` | ✅ igual |
| Trámites | `/tramites` | *(no existe)* | ❌ falta en backend |
| Alquileres | `/alquileres` | *(no existe)* | ❌ falta en backend |
| Instagram | `/instagram` | *(no existe)* | ❌ falta en backend |

Fuentes:
- Frontend: `src/api/endpoints.ts`
- Backend: controladores en `app/Controllers/Api/`
  (`ProfesionalesController`, `NovedadesController`, `BoletinesOficialesController`, `ObrasSocialesController`)

### 4.2 Falta la autenticación Bearer en el frontend

El backend exige el header `Authorization: Bearer <API_API_KEY>` en **todas**
las peticiones (`app/Controllers/Api/ApiController.php:70` → `requireAuth()`).
El cliente Axios del frontend **no envía** ese header (solo `Content-Type` y
`Accept`). Resultado: **todo request devuelve 401**.

### 4.3 Bug en `config.mocks.enabled`

En `src/config/index.ts:21`:

```ts
mocks: {
  enabled: import.meta.env.VITE_USE_MOCKS === 'false',  // ⚠️ INVERTIDO
}
```

Debería ser `=== 'true'`. Con el código actual, cuando `VITE_USE_MOCKS=true`
(default en desarrollo) `enabled=false`, por lo que la app **intenta conectar
con la API real** en lugar de usar mocks.

### 4.4 Mapeo de campos (contrato de datos)

Los tipos del frontend no coinciden con los campos que devuelve el backend:

**Obras sociales** — `src/types/index.ts:92` espera:

```ts
interface ObraSocial { id; nombre; logo; descripcion; telefono; email; sitioWeb }
```

Backend devuelve (`app/Controllers/Api/ObrasSocialesController.php:19`):

```ts
{ id; nombre; descripcion; telefono; correo; url_sitio_web; usuario_abm; created_at; updated_at }
```

| Campo frontend | Campo backend | Estado |
|---|---|---|
| `logo` | *(no existe)* | ❌ |
| `email` | `correo` | ❌ nombre distinto |
| `sitioWeb` | `url_sitio_web` | ❌ nombre distinto |
| `nombre`, `telefono`, `descripcion` | iguales | ✅ |

**Matriculados** — el frontend mapea desde un endpoint `/users` con formato
"JSONPlaceholder" (`src/api/services/matriculadosService.ts`). El backend real
expone `/profesionales` con formato distinto (`nro_matricula`, `nombre`,
`apellido`, `email`, `telefono`, `localidad`, `direccion`, `estado`,
`fecha_matriculacion`, `foto`, `created_at`, `updated_at` → `app/Controllers/Api/ProfesionalesController.php:27`).
El tipo `Matriculado` del frontend (`src/types/index.ts:54`) no coincide con
ese contrato.

---

## 5. Plan de conexión paso a paso

> Los pasos 1–4 son **obligatorios** para que el frontend funcione contra el
> backend real. Los pasos 5–7 resuelven los recursos que faltan en el backend.

### Paso 1 — Corregir el bug de mocks (frontend)

`src/config/index.ts:21` debe quedar:

```ts
enabled: import.meta.env.VITE_USE_MOCKS === 'true',
```

Así, con `VITE_USE_MOCKS=true` se usan los mocks, y con `false` se llama a la API.

### Paso 2 — Enviar el token Bearer (frontend)

En `src/api/client.ts` agregar el header `Authorization` usando la clave de
`config`. La clave debe leerse desde `.env` (`VITE_APP_API_KEY`) en
`src/config/index.ts` y luego:

```ts
const apiClient = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${config.api.apiKey}`,
  },
});
```

> ⚠️ **Seguridad:** nunca exponer esta clave en un entorno al que terceros
> tengan acceso. Evaluar si la API pública debería autorizar recursos de solo
> lectura sin token (ver [sección 6](#6-autenticación-bearer)).

### Paso 3 — Alinear endpoints existentes (backend o frontend)

Para los recursos que **sí existen** en ambos, unificar el nombre:

| Recurso | Endpoint canónico propuesto |
|---|---|
| Noticias / Novedades | `/novedades` (backend) → ajustar `endpoints.ts` |
| Boletín oficial | `/boletines-oficiales` (backend) → ajustar `endpoints.ts` |
| Matriculados | `/profesionales` (backend) → ajustar `endpoints.ts` y el service |

### Paso 4 — Alinear el mapeo de campos

En los services del frontend, mapear los campos del backend al tipo de la UI:

- `ObraSocial`: mapear `correo → email`, `url_sitio_web → sitioWeb`; resolver
  `logo` (o agregar el campo/logo en el backend).
- `Matriculado`: reescribir `matriculadosService.getAll()` para consumir
  `/profesionales` y mapear `nro_matricula/nombre/apellido/...` al tipo
  `Matriculado`.

### Paso 5-7 — Recursos que faltan en el backend (según prioridad)

No existen endpoints para trámites, alquileres ni Instagram. Pendiente decidir:

| Recurso | Estado | Acción propuesta |
|---|---|---|
| Trámites | no existe en backend | Crear endpoint + tabla |
| Alquileres | no existe en backend | Crear endpoint + tabla |
| Instagram | no existe en backend | Consumir Graph API de Instagram o endpoint propio |

> Cada uno de estos requiere decisión de alcance (¿datos reales o solo mock?)
> antes de implementarse.

---

## 6. Autenticación Bearer

- **Backend:** exige `Authorization: Bearer <API_API_KEY>` en cada request
  (`app/Controllers/Api/ApiController.php:70`). Si falta o es inválido →
  HTTP `401`. La clave está en `.env` → `API_API_KEY`.
- **Frontend:** hoy no envía el header (ver [paso 2](#paso-2--enviar-el-token-bearer-frontend)).
- **Discusión pendiente:** como la SPA es pública, exponer la clave Bearer en el
  bundle es un riesgo de seguridad. Opciones:
  1. Mantener el token (simple, pero la clave queda visible en el cliente).
  2. Permitir recursos de solo lectura sin autenticación en el backend y
     reservar el token solo para escritura (recomendado si hay datos públicos).
  3. Proxy inverso / BFF que inyecte el token en el servidor (más robusto).

---

## 7. CORS

El backend ya habilita CORS de forma amplia en `public/index.php:31-39`:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Key');
... // OPTIONS → 204
```

- `Access-Control-Allow-Origin: *` → permite que la SPA (dev server en `:5173`
  o dominio de producción) se conecte desde cualquier origen.
- Incluye `Authorization` en los headers permitidos → compatible con el token
  Bearer.
- No requiere cambios salvo que en producción se quiera restringir a un origen
  específico (reemplazar `*` por el dominio del frontend).

---

## 8. Glosario de archivos involucrados

### Frontend (`cpee_front/`)

| Archivo | Responsabilidad |
|---|---|
| `.env` / `.env.example` | `VITE_API_URL`, `VITE_APP_API_KEY`, `VITE_USE_MOCKS`, `VITE_ENABLE_LOGS`, `VITE_API_TIMEOUT`, `VITE_WHATSAPP_NUMBER` |
| `src/config/index.ts` | Lee las variables `.env` (incluye `config.mocks.enabled` — bug en 4.3) |
| `src/api/client.ts` | Cliente Axios: `baseURL`, `timeout`, headers, interceptor de errores |
| `src/api/endpoints.ts` | Centraliza las rutas de los endpoints |
| `src/api/services/*.ts` | Un servicio por recurso; extrae `data.data` |
| `src/hooks/queries/*.ts` | Hooks de React Query; eligen service real vs mock |
| `src/types/index.ts` | Interfaces de dominio (contratos con el backend) |

### Backend (`cpee/`)

| Archivo | Responsabilidad |
|---|---|
| `public/index.php` | Router global + bloque de API `/api/v1` y CORS |
| `public/.htaccess` | Rewrite de clean URLs hacia `index.php` |
| `app/Controllers/Api/ApiController.php` | Base: `requireAuth()` (Bearer), `success()`, `error()`, `json()` |
| `app/Controllers/Api/*Controller.php` | CRUD/lectura por recurso |
| `app/Models/*Model.php` | Acceso a datos PDO |
| `.env` | `API_ENABLED`, `API_API_KEY`, conexión PostgreSQL |
| `documentacion/10_api_profesionales.md`, `11_api_boletines_novedades.md` | Documentación oficial de la API |

---

## Diagrama de dependencias de la conexión

```
.env (frontend)
  └─► src/config/index.ts          (config.api.url, config.mocks.enabled, apiKey)
        └─► src/api/client.ts      (Axios: baseURL + headers + Authorization opcional)
              └─► src/api/endpoints.ts   (rutas de recursos)
                    └─► src/api/services/*.ts
                          └─► src/hooks/queries/*.ts
                                └─► src/pages/**/*.tsx
                                          │
                                          ▼ HTTP (CORS habilitado)
                                    public/index.php (backend)
                                          └─► app/Controllers/Api/*Controller.php
                                                └─► app/Models/*Model.php ─► PostgreSQL
```
