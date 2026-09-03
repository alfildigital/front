# Guía de flujo de navegación — CPEE Frontend

> **Audiencia:** Desarrolladores y diseñadores que necesiten entender cómo el usuario recorre la aplicación, qué ve en cada ruta, desde dónde puede llegar a cada página y qué datos carga cada vista.

---

## Tabla de contenidos

1. [Arranque de la aplicación](#1-arranque-de-la-aplicación)
2. [Estructura visual global](#2-estructura-visual-global)
3. [Mapa completo de rutas](#3-mapa-completo-de-rutas)
4. [Flujo de navegación detallado por página](#4-flujo-de-navegación-detallado-por-página)
5. [Navbar: estructura y comportamiento](#5-navbar-estructura-y-comportamiento)
6. [Lazy loading y estado de carga entre páginas](#6-lazy-loading-y-estado-de-carga-entre-páginas)
7. [Diagrama completo de navegación](#7-diagrama-completo-de-navegación)

---

## 1. Arranque de la aplicación

### Punto de entrada

```
index.html
  └─► src/main.tsx          ← monta React en <div id="root">
        └─► src/App.tsx     ← renderiza <RouterProvider>
              └─► src/router/index.tsx  ← define todas las rutas
```

### Providers que envuelven toda la app (`src/main.tsx`)

```tsx
<React.StrictMode>
  <HelmetProvider>            ← permite modificar <head> desde cualquier página (SEO)
    <QueryClientProvider>     ← provee el caché global de React Query
      <App />                 ← el router y todas las páginas
      <ReactQueryDevtools />  ← panel de debug (solo en desarrollo)
    </QueryClientProvider>
  </HelmetProvider>
</React.StrictMode>
```

Cuando el usuario accede a cualquier URL, React Router determina qué componente de página
renderizar. La transición entre páginas no recarga el navegador (SPA).

---

## 2. Estructura visual global

Todas las páginas (excepto la 404) usan el componente `<Layout>`:

```
┌──────────────────────────────────────────────────────────┐
│  <Navbar>                                                │
│  Logo | Inicio | Noticias | Trámites | Matriculados ▼    │
│         | Obras Sociales | Boletín Oficial | 🌿 | ☰      │
├──────────────────────────────────────────────────────────┤
│  <main id="main-content">                                │
│                                                          │
│  (Contenido de la página activa)                         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  <Footer>                                                │
│  © 2026 CPEE. Todos los derechos reservados.             │
└──────────────────────────────────────────────────────────┘
```

El `<Navbar>` es sticky (queda fijo en el top al hacer scroll) con fondo semitransparente
y efecto blur.

---

## 3. Mapa completo de rutas

| Ruta | Componente | Archivo |
|---|---|---|
| `/` | `HomePage` | `src/pages/Home/index.tsx` |
| `/noticias` | `NoticiasPage` | `src/pages/Noticias/index.tsx` |
| `/noticias/:id` | `NoticiaDetalle` | `src/pages/Noticias/NoticiaDetalle.tsx` |
| `/tramites` | `TramitesPage` | `src/pages/Tramites/index.tsx` |
| `/matriculados/pago` | `PagoPage` | `src/pages/Matriculados/Pago.tsx` |
| `/matriculados/listado` | `ListadoPage` | `src/pages/Matriculados/Listado.tsx` |
| `/matriculados/honorarios` | `HonorariosPage` | `src/pages/Matriculados/Honorarios.tsx` |
| `/matriculados/informacion` | `InformacionPage` | `src/pages/Matriculados/Informacion.tsx` |
| `/obras-sociales` | `ObrasSocialesPage` | `src/pages/ObrasSociales/index.tsx` |
| `/obras-sociales/aranceles` | `ArancelesPage` | `src/pages/ObrasSociales/Aranceles.tsx` |
| `/obras-sociales/requisitos` | `RequisitosPage` | `src/pages/ObrasSociales/Requisitos.tsx` |
| `/alquileres` | `AlquileresPage` | `src/pages/Alquileres/index.tsx` |
| `/boletin-oficial` | `BoletinPage` | `src/pages/BoletinOficial/index.tsx` |
| `*` (cualquier otra) | `NotFoundPage` | `src/pages/NotFound.tsx` |

---

## 4. Flujo de navegación detallado por página

---

### `/` — Página de Inicio (Home)

**¿Cómo llega el usuario?**
- Al escribir la URL base en el navegador
- Al hacer clic en el logo del Navbar
- Al hacer clic en el link "Inicio" del Navbar

**¿Qué ve?**

```
┌─ HERO ─────────────────────────────────────────────────┐
│ "Bienvenidos al Colegio de Profesionales..."           │
│ [Ver Trámites →]   [Últimas Noticias]                  │
│ 📞 (0351) 000-0000    📍 Sede Central — Av. Ejemplo   │
└────────────────────────────────────────────────────────┘

┌─ SECCIÓN TRÁMITES DESTACADOS ──────────────────────────┐
│ Muestra los primeros 4 trámites del array completo     │
│ API: GET /api/tramites  →  hook: useTramites()         │
│ [Card 1] [Card 2] [Card 3] [Card 4]                    │
└────────────────────────────────────────────────────────┘

┌─ SECCIÓN NOTICIAS (últimas 3) ─────────────────────────┐
│ API: GET /api/noticias  →  hook: useNoticias()         │
│ [Noticia 1] [Noticia 2] [Noticia 3]                    │
└────────────────────────────────────────────────────────┘

┌─ CAROUSEL INSTAGRAM (si hay posts) ────────────────────┐
│ API: GET /api/instagram  →  hook: useInstagram()       │
│ (se oculta si no hay datos, sin EmptyState)            │
└────────────────────────────────────────────────────────┘
```

**¿A dónde puede ir desde acá?**

| Elemento | Destino |
|---|---|
| Botón "Ver Trámites" | `/tramites` |
| Botón "Últimas Noticias" | `/noticias` |
| Click en una Noticia del preview | `/noticias/:id` |
| Cualquier link del Navbar | Ver sección Navbar |

---

### `/noticias` — Listado de Noticias

**¿Cómo llega el usuario?**
- Desde el Navbar → "Noticias"
- Desde el botón "Últimas Noticias" del Hero en Home
- URL directa

**¿Qué carga?**

```
API: GET /api/noticias
Hook: useNoticias()
Paginación: client-side con paginateItems()  (10 noticias por página)
```

**¿A dónde puede ir?**

| Elemento | Destino |
|---|---|
| Click en tarjeta de noticia | `/noticias/:id` |
| Controles de paginación | Misma ruta, cambia los items visibles |

---

### `/noticias/:id` — Detalle de Noticia

**¿Cómo llega el usuario?**
- Desde el listado `/noticias` al hacer click en una tarjeta
- Desde el preview de noticias en Home

**¿Qué carga?**

```
API: GET /api/noticias/{id}
Hook: useNoticia(id)   (toma el parámetro :id de la URL)
```

**¿A dónde puede ir?**

| Elemento | Destino |
|---|---|
| Botón "← Volver" | `/noticias` |
| Adjuntos | Descarga directa del archivo |

---

### `/tramites` — Trámites

**¿Cómo llega el usuario?**
- Desde el Navbar → "Trámites"
- Desde el botón "Ver Trámites" del Hero en Home
- URL directa

**¿Qué carga?**

```
API: GET /api/tramites
Hook: useTramites()
Paginación: client-side (10 trámites por página)
```

**¿Qué muestra cada tarjeta?**

- Ícono dinámico (resuelto desde string de la API → componente Lucide)
- Título y descripción
- Lista de requisitos (si los hay)
- Botón "Más información" → enlace externo (si existe `tramite.enlace`)

**¿A dónde puede ir?**

| Elemento | Destino |
|---|---|
| "Más información" | URL externa en nueva pestaña |
| Controles de paginación | Misma ruta |

---

### `/matriculados/pago` — Pago de Matrícula

**¿Cómo llega el usuario?**
- Navbar → "Matriculados" (dropdown) → "Pagar Matrícula"

**¿Qué carga?**

```
API: POST /api/matriculados/pago  (genera URL de checkout)
Hook: usePagoMatricula()
```

---

### `/matriculados/listado` — Listado de Profesionales

**¿Cómo llega el usuario?**
- Navbar → "Matriculados" → "Profesionales"

**¿Qué carga?**

```
API: GET /api/matriculados
Hook: useMatriculados()
Funcionalidad extra: buscador con debounce (useDebounce)
Paginación: client-side
```

---

### `/matriculados/honorarios` — Honorarios

**¿Cómo llega el usuario?**
- Navbar → "Matriculados" → "Honorarios"

**¿Qué carga?**

```
API: GET /api/honorarios
Hook: useHonorarios()
```

---

### `/matriculados/informacion` — Información Institucional

**¿Cómo llega el usuario?**
- URL directa (no aparece en el Navbar visible pero sí está en el router)

---

### `/obras-sociales` — Obras Sociales Adheridas

**¿Cómo llega el usuario?**
- Navbar → "Obras Sociales" (link directo)
- URL directa

**¿Qué carga?**

```
API: GET /api/obras-sociales
Hook: useObrasSociales()
Paginación: client-side (10 por página)
```

**¿Qué muestra cada tarjeta?**

- Logo de la obra social (o avatar con ícono Building2 si no hay imagen)
- Nombre de la obra social
- Descripción (si existe)
- Teléfono con enlace `tel:` (si existe)
- Email con enlace `mailto:` (si existe)
- Botón "Visitar sitio web" → enlace externo (si existe `sitioWeb`)

**¿A dónde puede ir?**

| Elemento | Destino |
|---|---|
| "Visitar sitio web" | URL externa en nueva pestaña |
| Teléfono | Marca el número (en móvil) |
| Email | Abre cliente de correo |
| Controles de paginación | Misma ruta |
| Navbar → "Aranceles" | `/obras-sociales/aranceles` |
| Navbar → "Requisitos para incorporación" | `/obras-sociales/requisitos` |

---

### `/obras-sociales/aranceles` — Aranceles

**¿Cómo llega el usuario?**
- Navbar → "Obras Sociales" → "Aranceles"

**Estado actual:** Página en construcción (muestra `EmptyState` con mensaje).

---

### `/obras-sociales/requisitos` — Requisitos para Incorporación

**¿Cómo llega el usuario?**
- Navbar → "Obras Sociales" → "Requisitos para incorporación"

**Estado actual:** Página en construcción (muestra `EmptyState` con mensaje).

---

### `/alquileres` — Alquileres

**¿Cómo llega el usuario?**
- Navbar → "Alquileres" (no aparece en la versión actual del Navbar)
- URL directa

**¿Qué carga?**

```
API: GET /api/alquileres
Hook: useAlquileres()
```

---

### `/boletin-oficial` — Boletín Oficial

**¿Cómo llega el usuario?**
- Navbar → "Boletín Oficial"
- URL directa

**¿Qué carga?**

```
API: GET /api/boletin-oficial
Hook: useBoletin()
```

---

### `*` — Página 404 (Not Found)

**¿Cuándo aparece?**
- Cuando el usuario escribe una URL que no existe en el router.

**¿Qué muestra?**
- Mensaje de error 404
- Botón para volver al inicio (`/`)

---

## 5. Navbar: estructura y comportamiento

### Links directos (sin submenú)

| Label en Navbar | Ruta destino |
|---|---|
| Inicio | `/` |
| Noticias | `/noticias` |
| Trámites | `/tramites` |
| Obras Sociales | `/obras-sociales` |
| Boletín Oficial | `/boletin-oficial` |

### Dropdowns (con submenú)

**Matriculados** (desplegable al hacer click):

| Sub-ítem | Ruta destino |
|---|---|
| Pagar Matrícula | `/matriculados/pago` |
| Honorarios | `/matriculados/honorarios` |
| Profesionales | `/matriculados/listado` |

> Nota: "Obras Sociales" en el Navbar es un link directo a `/obras-sociales`.
> Los sub-ítems de Obras Sociales (Aranceles, Requisitos) se definen en `src/config/constants.ts`
> pero no están expuestos como dropdown en la versión actual del Navbar.

### Comportamientos especiales del Navbar

| Comportamiento | Descripción |
|---|---|
| **Link activo** | El link de la ruta actual se resalta en color `primary` automáticamente (React Router `NavLink`) |
| **Dropdown se cierra** | Al hacer click fuera, al navegar a otra ruta, o al hacer click en un ítem |
| **Menú móvil** | En pantallas < 1024px aparece el ícono hamburguesa `☰`. Click → despliega menú vertical |
| **Tema claro/oscuro** | Botón `🌿` (Leaf) o `☀️` (Sun). Persiste la preferencia en `localStorage` |
| **Sticky** | `position: sticky; top: 0` — queda visible al hacer scroll |

---

## 6. Lazy loading y estado de carga entre páginas

Todas las páginas usan **lazy loading** con `React.lazy()` en el router:

```ts
const ObrasSociales = lazy(() => import('@/pages/ObrasSociales'));
```

Esto significa que el código JS de cada página **se descarga solo cuando el usuario navega a esa ruta**.
El bundle inicial es más pequeño y la app arranca más rápido.

### Estado de carga entre rutas (`Suspense`)

Mientras el JS de una página se descarga (primera visita), se muestra un spinner centrado:

```tsx
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" label="Cargando página..." />
    </div>
  );
}
```

### Estados de carga dentro de cada página (React Query)

Una vez que el JS de la página cargó, los datos de la API tienen sus propios estados:

```
isPending → <CardSkeletonGrid />   (tarjetas grises animadas)
isError   → <ErrorBanner />        (alerta roja con botón de reintento)
vacío     → <EmptyState />         (mensaje "Sin resultados")
datos     → <Grid de tarjetas />   (contenido real)
```

---

## 7. Diagrama completo de navegación

```
                        ┌───────────────┐
                        │   Navegador   │
                        │  (URL base)   │
                        └──────┬────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │   /  (Home)     │◄──── Logo del Navbar
                     │                 │
                     │ Hero            │
                     │  ├─► /tramites  │
                     │  └─► /noticias  │
                     │                 │
                     │ Trámites (4)    │
                     │ Noticias (3)    │──────► /noticias/:id
                     │ Instagram       │
                     └─────────────────┘

Navbar (siempre visible):
  ├── Inicio ─────────────────────────────────► /
  ├── Noticias ───────────────────────────────► /noticias
  │                                                └─► /noticias/:id
  ├── Trámites ───────────────────────────────► /tramites
  │
  ├── Matriculados (dropdown)
  │     ├── Pagar Matrícula ──────────────────► /matriculados/pago
  │     ├── Honorarios ────────────────────────► /matriculados/honorarios
  │     └── Profesionales ──────────────────────► /matriculados/listado
  │
  ├── Obras Sociales ─────────────────────────► /obras-sociales
  │                                               ├── /obras-sociales/aranceles
  │                                               └── /obras-sociales/requisitos
  │
  └── Boletín Oficial ────────────────────────► /boletin-oficial

Rutas adicionales (acceso directo por URL):
  ├── /alquileres
  ├── /matriculados/informacion
  └── * (cualquier otra) ─────────────────────► 404 Not Found
                                                   └─► / (botón volver)
```

### Flujo de datos en cada ruta

```
Ruta visitada
    │
    ▼
Componente montado
    │
    ├── useXxx() hook (React Query)
    │       │
    │       ├── ¿Hay caché fresco? → retorna datos al instante
    │       └── No → GET /api/xxx → retorna datos y los cachea
    │
    ├── usePagination() (si la página tiene paginación)
    │       └── page=1, pageSize=10 (valores iniciales)
    │
    └── paginateItems(data, page, pageSize)
            └── Recorta el array: muestra items 1-10 de N
```
