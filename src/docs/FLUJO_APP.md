# Flujo de Información — Frontend Institucional

Documento de referencia para entender la arquitectura, las rutas, los módulos de datos y los puntos de modificación de la aplicación.

---

## 1. Punto de entrada

```
index.html
  └── src/main.tsx              ← monta React, configura QueryClient y HelmetProvider
        └── src/App.tsx         ← entrega el control al router
              └── src/router/index.tsx  ← define todas las rutas y lazy loading
```

### `src/main.tsx`
- Crea la instancia de `QueryClient` con `staleTime: 5 min` y `gcTime: 10 min`.
- Envuelve la app en `HelmetProvider` (SEO) y `QueryClientProvider` (datos).
- Activa `ReactQueryDevtools` en desarrollo.

### `src/router/index.tsx`
- Usa `createBrowserRouter` de React Router v6.
- Todas las páginas se cargan con `lazy()` + `Suspense` → reduce el bundle inicial.

---

## 2. Mapa de rutas

| Ruta | Página (componente) | Archivo |
|------|---------------------|---------|
| `/` | Home | `src/pages/Home/index.tsx` |
| `/noticias` | Listado de noticias | `src/pages/Noticias/index.tsx` |
| `/noticias/:id` | Detalle de noticia | `src/pages/Noticias/NoticiaDetalle.tsx` |
| `/tramites` | Trámites | `src/pages/Tramites/index.tsx` |
| `/matriculados/pago` | Pago de matrícula | `src/pages/Matriculados/Pago.tsx` |
| `/matriculados/listado` | Listado de profesionales | `src/pages/Matriculados/Listado.tsx` |
| `/matriculados/honorarios` | Honorarios | `src/pages/Matriculados/Honorarios.tsx` |
| `/matriculados/informacion` | Información institucional | `src/pages/Matriculados/Informacion.tsx` |
| `/obras-sociales` | Obras sociales (página única) | `src/pages/ObrasSociales/index.tsx` |
| `/alquileres` | Alquileres | `src/pages/Alquileres/index.tsx` |
| `/boletin-oficial` | Boletín oficial | `src/pages/BoletinOficial/index.tsx` |
| `*` | 404 Not Found | `src/pages/NotFound.tsx` |

> **Nota:** Las rutas `/obras-sociales/aranceles` y `/obras-sociales/requisitos` siguen existiendo en el router para compatibilidad, pero el navbar ya no las enlaza directamente. Todo el contenido de obras sociales está en `/obras-sociales`.

---

## 3. Flujo de datos por módulo

El patrón general es:

```
Page
  └── Hook (React Query)
        └── Service (selección mock/real según VITE_USE_MOCKS)
              ├── Real  → Axios Client → API PHP
              └── Mock  → datos locales con delay simulado
```

### 3.1 Noticias

```
src/pages/Noticias/index.tsx         ← listado paginado
src/pages/Noticias/NoticiaDetalle.tsx ← detalle con adjuntos
src/pages/Home/index.tsx             ← preview (primeras 3)
  └── src/hooks/queries/useNoticias.ts
        └── src/api/services/noticiasService.ts   → GET /api/noticias
            src/api/services/noticiasService.ts   → GET /api/noticias/:id
        └── src/mocks/services/mockNoticiasService.ts  (si VITE_USE_MOCKS=true)
              └── src/mocks/data/noticias.ts
```

### 3.2 Trámites

```
src/pages/Tramites/index.tsx         ← listado paginado
src/pages/Home/index.tsx             ← sección destacada (primeros 4)
  └── src/hooks/queries/useTramites.ts
        └── src/api/services/tramitesService.ts   → GET /api/tramites
        └── src/mocks/services/mockTramitesService.ts
              └── src/mocks/data/tramites.ts
```

### 3.3 Matriculados

```
src/pages/Matriculados/Listado.tsx   ← búsqueda + paginación
  └── src/hooks/queries/useMatriculados.ts  (useMatriculados)
        └── src/api/services/matriculadosService.ts  → GET /api/matriculados
        └── src/mocks/services/mockMatriculadosService.ts
              └── src/mocks/data/matriculados.ts
  └── src/utils/matriculadosUtils.ts        (filterMatriculados)
  └── src/utils/paginationUtils.ts          (paginateItems)
  └── src/hooks/usePagination.ts            (estado de página)

src/pages/Matriculados/Pago.tsx      ← redirección a Mercado Pago
  └── src/hooks/queries/useMatriculados.ts  (usePagoMatricula)
        └── src/api/services/matriculadosService.ts  → GET /api/matriculados/pago

src/pages/Matriculados/Honorarios.tsx ← PDFs e imágenes
  └── src/hooks/queries/useMatriculados.ts  (useHonorarios)
        └── src/api/services/matriculadosService.ts  → GET /api/honorarios
```

### 3.4 Obras Sociales

```
src/pages/ObrasSociales/index.tsx    ← página única con 3 secciones:
                                        1. Listado paginado de obras sociales
                                        2. Aranceles [PROVISIONAL]
                                        3. Requisitos para incorporación [PROVISIONAL]
  └── src/hooks/queries/useObrasSociales.ts
        └── src/api/services/obrasSocialesService.ts → GET /api/obras-sociales
        └── src/mocks/services/mockObrasSocialesService.ts
              └── src/mocks/data/obrasSociales.ts
```

### 3.5 Alquileres

```
src/pages/Alquileres/index.tsx       ← listado paginado con disponibilidad
  └── src/hooks/queries/useAlquileres.ts
        └── src/api/services/alquileresService.ts  → GET /api/alquileres
        └── src/mocks/services/mockAlquileresService.ts
              └── src/mocks/data/alquileres.ts
```

### 3.6 Boletín Oficial

```
src/pages/BoletinOficial/index.tsx   ← listado paginado, orden fecha desc.
  └── src/hooks/queries/useBoletin.ts
        └── src/api/services/boletinService.ts     → GET /api/boletin-oficial
        └── src/mocks/services/mockBoletinService.ts
              └── src/mocks/data/boletin.ts
```

### 3.7 Instagram

```
src/pages/Home/index.tsx             ← galería (se oculta si no hay posts)
  └── src/hooks/queries/useInstagram.ts
        └── src/api/services/instagramService.ts   → GET /api/instagram
        └── src/mocks/services/mockInstagramService.ts
              └── src/mocks/data/instagram.ts
```

---

## 4. Paginación

La paginación es **client-side** en la versión actual: se traen todos los datos de la API y se pagina localmente.

### Piezas involucradas

| Archivo | Responsabilidad |
|---------|----------------|
| `src/hooks/usePagination.ts` | Estado: página actual, tamaño, reset |
| `src/utils/paginationUtils.ts` | Función pura: cortar el array según página/tamaño |
| `src/components/common/Pagination.tsx` | UI: botones, ellipsis, selector de tamaño |

### Tamaños disponibles
`10 / 20 / 50 / 100`

### Páginas con paginación activa
- `/noticias`
- `/tramites`
- `/matriculados/listado` (también con filtro de búsqueda)
- `/obras-sociales`
- `/alquileres`
- `/boletin-oficial`

### Migración a paginación server-side
Cuando el backend incorpore paginación:
1. Eliminar el uso de `paginateItems` en el hook o page correspondiente.
2. Pasar `page` y `pageSize` como parámetros al service.
3. El service envía `?page=X&per_page=Y` a la API.
4. El hook recibe `PaginatedResponse<T>` (ya definido en `src/types/api.ts`).
5. El componente `Pagination` no requiere cambios.

---

## 5. Capas de la arquitectura

```
src/
├── api/
│   ├── client.ts          ← instancia Axios: baseURL, timeout, interceptor de errores
│   ├── endpoints.ts       ← todas las URLs de la API (strings centralizados)
│   └── services/          ← una función por endpoint (getAll, getById, etc.)
│
├── hooks/
│   ├── useDebounce.ts     ← debounce genérico para inputs de búsqueda
│   ├── usePagination.ts   ← estado de paginación (page, pageSize, reset)
│   └── queries/           ← React Query hooks; seleccionan mock o real
│
├── mocks/
│   ├── data/              ← arrays de datos tipados para desarrollo
│   └── services/          ← reimplementan la misma interfaz que los servicios reales
│
├── components/
│   ├── common/            ← Skeleton, Spinner, ErrorBanner, EmptyState, Card, Pagination
│   ├── layout/            ← Navbar, Footer, Layout
│   └── sections/          ← InstagramCarousel, NoticiasPreview, TramitesDestacados
│
├── pages/                 ← una carpeta por módulo, index.tsx como entrada
│
├── types/
│   ├── api.ts             ← ApiResponse<T>, PaginatedResponse<T>, ApiError
│   └── index.ts           ← interfaces de dominio (Noticia, Tramite, Matriculado…)
│
├── config/
│   ├── index.ts           ← acceso centralizado a import.meta.env
│   └── constants.ts       ← SITE_NAME, QUERY_KEYS
│
├── utils/
│   ├── formatters.ts      ← formatDate, formatMoney, formatFileSize, truncateText
│   ├── validators.ts      ← type guards
│   ├── matriculadosUtils.ts ← filterMatriculados
│   └── paginationUtils.ts   ← paginateItems
│
├── router/
│   └── index.tsx          ← createBrowserRouter con lazy loading
│
└── docs/
    ├── ARQUITECTURA.md    ← descripción de capas y flujo de datos
    ├── DECISIONES.md      ← principios vigentes y contratos provisionales
    └── FLUJO_APP.md       ← este archivo
```

---

## 6. Configuración del entorno

| Variable | Descripción | Archivo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API PHP | `src/api/client.ts` |
| `VITE_API_TIMEOUT` | Timeout en ms | `src/api/client.ts` |
| `VITE_WHATSAPP_NUMBER` | Número sin `+` | `src/pages/Matriculados/Pago.tsx` |
| `VITE_ENABLE_LOGS` | Logs de errores en consola | `src/api/client.ts` |
| `VITE_USE_MOCKS` | `true` → datos locales / `false` → API real | `src/hooks/queries/*.ts` |

Acceso centralizado: **`src/config/index.ts`** — ninguna otra capa usa `import.meta.env` directamente.

---

## 7. Tema / Modo sustentable

| Elemento | Archivo |
|----------|---------|
| Lógica de activación | `src/components/layout/Navbar.tsx` → `applyTheme()` |
| Persistencia | `localStorage` bajo la clave `theme` |
| Clases CSS | Tailwind `dark:` — activado con `darkMode: 'class'` en `tailwind.config.js` |
| Paleta oscura | fondo `#0d1f2d` (`surface.dark`), primarios sin cambio |

---

## 8. Dónde modificar cada cosa

| Necesidad | Archivo(s) a modificar |
|-----------|------------------------|
| Agregar una ruta | `src/router/index.tsx` + nueva página en `src/pages/` |
| Cambiar un link del navbar | `src/components/layout/Navbar.tsx` → `NAV_ITEMS` |
| Agregar un endpoint | `src/api/endpoints.ts` → `src/api/services/` → `src/hooks/queries/` |
| Cambiar la URL base de la API | `.env` → `VITE_API_URL` |
| Cambiar datos de prueba | `src/mocks/data/` → archivo del módulo correspondiente |
| Actualizar un contrato de API | `src/types/index.ts` → `src/api/services/*.ts` |
| Cambiar colores | `tailwind.config.js` → tokens `primary` / `secondary` / `surface` |
| Agregar un campo a una interfaz provisional | `src/types/index.ts` → ver `src/docs/DECISIONES.md` |
| Cambiar el tamaño de página por defecto | `usePagination({ defaultPageSize: N })` en la page correspondiente |
| Migrar filtrado a server-side | Reemplazar `filterMatriculados` + hook → `useMatriculados(query)` |

---

## 9. Scripts disponibles

```bash
pnpm dev           # servidor de desarrollo (puerto 5173, con mocks)
pnpm build         # build de producción (tsc + vite)
pnpm preview       # preview del build
pnpm lint          # ESLint sobre todo el proyecto
pnpm test          # Vitest en watch mode
pnpm test:coverage # cobertura con V8
```
