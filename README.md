# Frontend Institucional

SPA pública para un colegio/institución profesional.  
Construida con **Vite + React + TypeScript + Tailwind CSS**.  
Consume una API REST PHP. Sin autenticación en esta versión.

---

## Requisitos

- [Node.js](https://nodejs.org) ≥ 18
- [pnpm](https://pnpm.io) ≥ 8

```bash
npm install -g pnpm
```

---

## Instalación

```bash
pnpm install
```

---

## Variables de entorno

Copiar el archivo de ejemplo y ajustar los valores:

```bash
cp .env.example .env
```

Variables disponibles:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API PHP | `http://localhost:8000/api` |
| `VITE_API_TIMEOUT` | Timeout de peticiones (ms) | `30000` |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp (sin `+`) | `5491123456789` |
| `VITE_ENABLE_LOGS` | Habilitar logs de errores en consola | `true` |
| `VITE_USE_MOCKS` | Usar datos mock (sin API real) | `true` |

---

## Comandos

```bash
# Servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Linter
pnpm lint

# Tests (watch mode)
pnpm test

# Tests con cobertura
pnpm test:coverage
```

---

## Mocks para desarrollo

Los mocks permiten usar la aplicación **sin necesidad de la API PHP**.

**Activar mocks** (default en desarrollo):
```bash
# .env.development
VITE_USE_MOCKS=true
```

**Desactivar mocks** (usar API real):
```bash
VITE_USE_MOCKS=false
```

Los datos mock están en `src/mocks/data/`.  
Los servicios mock están en `src/mocks/services/`.  
Ambos respetan las mismas interfaces TypeScript que la API real.

---

## Modo sustentable

El frontend incluye un **modo oscuro** llamado "modo sustentable" 🌿.  
Se activa con el botón de hoja en la barra de navegación.  
La preferencia se guarda en `localStorage`.

---

## Estructura del proyecto

```
src/
├── api/           — Cliente Axios y servicios HTTP
├── components/    — Componentes reutilizables y de layout
├── config/        — Variables de entorno centralizadas
├── docs/          — Documentación de arquitectura y decisiones
├── hooks/         — useDebounce + hooks de React Query
├── mocks/         — Datos y servicios mock para desarrollo
├── pages/         — Páginas de la aplicación
├── router/        — Configuración de React Router
├── test/          — Tests y configuración de Vitest
├── types/         — Interfaces TypeScript
└── utils/         — Utilidades puras (formatters, validators)
```

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home |
| `/noticias` | Listado de noticias |
| `/noticias/:id` | Detalle de noticia |
| `/tramites` | Trámites institucionales |
| `/matriculados/pago` | Pago de matrícula (Mercado Pago) |
| `/matriculados/listado` | Listado de profesionales |
| `/matriculados/honorarios` | Tablas de honorarios |
| `/matriculados/informacion` | Información institucional |
| `/obras-sociales` | Obras sociales adheridas |
| `/obras-sociales/aranceles` | Aranceles |
| `/obras-sociales/requisitos` | Requisitos de incorporación |
| `/alquileres` | Espacios para alquiler |
| `/boletin-oficial` | Boletín oficial |

---

## Documentación adicional

- [`src/docs/ARQUITECTURA.md`](src/docs/ARQUITECTURA.md) — Arquitectura y flujo de datos
- [`src/docs/DECISIONES.md`](src/docs/DECISIONES.md) — Decisiones de diseño y contratos provisionales

---

## Conectar con la API PHP

1. Desactivar mocks: `VITE_USE_MOCKS=false`
2. Configurar `VITE_API_URL` con la URL del backend
3. Revisar `src/docs/DECISIONES.md` para validar los contratos JSON con el backend
4. Ajustar las interfaces en `src/types/index.ts` si es necesario
