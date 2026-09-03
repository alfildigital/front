# Relevamiento para Producción — CPEE Frontend

> **Objetivo:** Identificar todos los ítems pendientes, decisiones sin tomar y tareas técnicas necesarias
> para pasar el frontend a un entorno de producción real.  
> Este documento es el punto de partida para coordinar con el equipo de backend y de infraestructura.

---

## Estado general del proyecto

| Área | Estado |
|---|---|
| Estructura del frontend | ✅ Completa |
| Sistema de diseño (Tailwind, dark mode) | ✅ Completo |
| Componentes comunes (Card, Skeleton, ErrorBanner, Pagination) | ✅ Completos |
| Router + lazy loading | ✅ Completo |
| Mocks para todas las entidades | ✅ Completos |
| Backend PHP | ❌ No desarrollado todavía |
| Contratos de API | ❌ Ninguno confirmado (salvo `/matriculados/pago`) |
| Infraestructura de deploy | ❌ Sin definir |
| Datos institucionales reales | ⚠️ Parcialmente definidos |

---

## BLOQUE 1 — Datos institucionales pendientes

### 1.1 Hero de la Home
**Archivo:** `src/pages/Home/index.tsx` — componente `Hero()`

En este momento la sección de inicio muestra valores de ejemplo:

```tsx
<span>Consultas: (0351) 000-0000</span>       ← placeholder
<span>Sede Central — Av. Ejemplo 1234</span>  ← placeholder
```

**Necesitamos definir:**

| Dato | Valor real | Estado |
|---|---|---|
| Teléfono de consultas | — | ⚠️ PENDIENTE |
| Dirección de la sede central | — | ⚠️ PENDIENTE |

**Acción:** Proporcionar los datos reales para reemplazar los placeholders.

---

### 1.2 Número de WhatsApp
**Archivo:** `.env.production`

El número institucional de WhatsApp se usa en la página de Pago de Matrícula
para el botón "Consultar por WhatsApp". Actualmente en producción el valor es un placeholder.

| Dato | Valor real | Estado |
|---|---|---|
| Número WhatsApp (sin `+`) | — | ⚠️ PENDIENTE |

**Formato:** `5493511234567` (54 = Argentina, 351 = Córdoba, luego el número sin 0 ni 15)

---

### 1.3 Logo de la institución
**Archivo:** `public/logo.jpg` (referenciado en `src/components/layout/Navbar.tsx`)

✅ El archivo `public/logo.jpg` ya existe en el repositorio.

**Verificación pendiente:** Confirmar que la imagen tiene la calidad y el tamaño adecuados
para verse bien en la barra de navegación (contenedor de 32×32px, `object-cover`).

---

### 1.4 Nombre del sitio
**Archivo:** `src/config/constants.ts`

```ts
export const SITE_NAME = 'Colegio de Profesionales en Educación Especial';
```

✅ Confirmado. Se usa en todos los `<title>` de página, en el navbar y en el footer.

---

## BLOQUE 2 — Backend PHP: endpoints sin desarrollar

> El backend NO está desarrollado todavía.  
> El frontend está listo para consumirlos en el momento en que estén disponibles.  
> Solo hay que cambiar `VITE_USE_MOCKS=false` y apuntar `VITE_API_URL` al servidor.

### Contrato de respuesta estándar esperado

El cliente Axios del frontend espera que **todos** los endpoints respondan con este wrapper:

```json
{
  "success": true,
  "data": [ ... ]
}
```

Si el backend responde con un formato diferente (ej: el array directo sin wrapper), el único
cambio necesario es en `src/api/services/*.ts` — las páginas y componentes no se modifican.

---

### 2.1 Noticias

**Endpoint real:** `GET /api/noticias`  
**Servicio:** `src/api/services/noticiasService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "string",
      "resumen": "string",
      "contenido": "string (HTML o texto plano)",
      "imagen": "URL absoluta | null",
      "fecha": "ISO 8601 — ej: 2024-11-15T10:00:00Z",
      "categoria": "string",
      "adjuntos": [
        {
          "id": 1,
          "nombre": "Archivo.pdf",
          "url": "URL absoluta",
          "tipo": "pdf | docx | jpg | ...",
          "tamanio": 204800
        }
      ]
    }
  ]
}
```

**Endpoint adicional:** `GET /api/noticias/:id` — devuelve `ApiResponse<Noticia>` (mismo objeto individual)

---

### 2.2 Trámites

**Endpoint real:** `GET /api/tramites`  
**Servicio:** `src/api/services/tramitesService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "string",
      "descripcion": "string",
      "requisitos": ["string", "string"],
      "enlace": "URL | null",
      "icono": "BadgeCheck | FileCheck | RefreshCw | Stamp | null"
    }
  ]
}
```

> **Nota sobre iconos:** El campo `icono` debe ser uno de los nombres de componente
> de la librería Lucide React que están mapeados en la página:
> `BadgeCheck`, `FileCheck`, `RefreshCw`, `Stamp`.
> Si el valor no coincide, se muestra un ícono `HelpCircle` como fallback.
> Se puede ampliar el mapa en `src/pages/ObrasSociales/index.tsx` → `ICON_MAP`.

---

### 2.3 Matriculados

**Endpoint real:** `GET /api/matriculados`  
**Servicio:** `src/api/services/matriculadosService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Apellido, Nombre",
      "matricula": "MP-1234",
      "especialidad": "string",
      "telefono": "string | null",
      "email": "string | null",
      "foto": "URL absoluta | null"
    }
  ]
}
```

> **Nota sobre `foto`:** Se espera una URL absoluta lista para usar en `<img src>`.
> Si el backend devuelve una ruta relativa, hay que agregar el prefijo `config.api.url`
> en `src/api/services/matriculadosService.ts`.

---

### 2.4 Pago de matrícula — Mercado Pago

**Endpoint real:** `GET /api/matriculados/pago`  
**Servicio:** `src/api/services/matriculadosService.ts`  
**Estado:** ✅ Implementado en el backend

**Contrato confirmado:**

```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=XXXX"
  }
}
```

> El frontend lee `data.checkoutUrl` y lo pone como `href` del botón "Pagar con Mercado Pago".

---

### 2.5 Honorarios

**Endpoint real:** `GET /api/honorarios`  
**Servicio:** `src/api/services/matriculadosService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "string",
      "descripcion": "string | null",
      "tipo": "imagen | pdf",
      "url": "URL absoluta del archivo o imagen",
      "fecha": "ISO 8601 | null"
    }
  ]
}
```

---

### 2.6 Obras Sociales

**Endpoint real:** `GET /api/obras-sociales`  
**Servicio:** `src/api/services/obrasSocialesService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "string",
      "logo": "URL absoluta | null",
      "descripcion": "string | null",
      "telefono": "string | null",
      "email": "string | null",
      "sitioWeb": "URL | null"
    }
  ]
}
```

---

### 2.7 Alquileres

**Endpoint real:** `GET /api/alquileres`  
**Servicio:** `src/api/services/alquileresService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "string",
      "descripcion": "string",
      "imagen": "URL absoluta | null",
      "direccion": "string | null",
      "precio": 5000,
      "moneda": "ARS | USD",
      "disponible": true,
      "contactoNombre": "string | null",
      "contactoTelefono": "string | null",
      "contactoEmail": "string | null"
    }
  ]
}
```

---

### 2.8 Boletín Oficial

**Endpoint real:** `GET /api/boletin-oficial`  
**Servicio:** `src/api/services/boletinService.ts`  
**Estado:** ❌ Sin desarrollar

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "string",
      "descripcion": "string | null",
      "fecha": "ISO 8601",
      "adjuntos": [
        {
          "id": 1,
          "nombre": "Resolución.pdf",
          "url": "URL absoluta",
          "tipo": "pdf",
          "tamanio": 204800
        }
      ]
    }
  ]
}
```

> **Nota:** El frontend ordena los ítems por fecha descendente en el cliente. Si el backend ya
> devuelve el array ordenado, no hay problema — el ordenamiento en el cliente es inocuo.

---

### 2.9 Instagram (proxy)

**Endpoint real:** `GET /api/instagram`  
**Servicio:** `src/api/services/instagramService.ts`  
**Estado:** ❌ Sin desarrollar

**Decisión confirmada:** El backend PHP actúa como proxy de la Instagram Graph API.
El frontend solo llama a `/api/instagram` y nunca habla directo con Meta.

**Contrato esperado (provisional):**

```json
{
  "success": true,
  "data": [
    {
      "id": "string (ID de Instagram)",
      "imageUrl": "URL de la imagen del post",
      "caption": "string | null",
      "permalink": "https://www.instagram.com/p/...",
      "timestamp": "ISO 8601"
    }
  ]
}
```

> **Comportamiento especial:** Si la API devuelve un array vacío, la sección de Instagram
> en el Home se **oculta completamente** (sin EmptyState). Esto es intencional.
> Si hay error, muestra el `ErrorBanner`.

---

### 2.10 Información Institucional

**Endpoint real:** No definido  
**Página:** `src/pages/Matriculados/Informacion.tsx`  
**Estado:** ⚠️ La página existe pero muestra "Contenido en construcción"

**Decisión pendiente:** El contenido de esta página viene del backend PHP.
El contrato JSON no está definido todavía.

**Acción:** Definir qué muestra esta página (texto institucional, autoridades, misión/visión, etc.)
y diseñar el endpoint y el contrato correspondiente.

---

## BLOQUE 3 — CORS en el backend PHP

El frontend corre en el dominio del cliente (ej: `https://cpee.org.ar`) y hace peticiones
HTTP al backend PHP. El backend **debe** incluir los headers CORS correctos.

```php
// En el backend PHP (middleware o al inicio de cada endpoint)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// En desarrollo:
$allowed = ['http://localhost:5173'];
// En producción (reemplazar con el dominio real):
$allowed = ['https://cpee.org.ar'];

if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

> **Importante:** No usar `Access-Control-Allow-Origin: *` en producción.
> Usar el origen exacto del frontend.

---

## BLOQUE 4 — Infraestructura de deploy

**Estado:** ❌ Sin definir todavía

El frontend es una SPA (Single Page Application) generada con `pnpm build`.
El resultado es una carpeta `dist/` con archivos estáticos (HTML, JS, CSS, imágenes).

### Consideración crítica para SPAs

El router usa `createBrowserRouter` (HTML5 History API). Si el servidor no está configurado
para ello, **al refrescar cualquier ruta que no sea `/` dará 404**.

| Infraestructura | Qué configurar |
|---|---|
| **Nginx** | `try_files $uri $uri/ /index.html;` |
| **Apache / cPanel** | Archivo `.htaccess` con rewrite rules |
| **Vercel** | Automático (detecta Vite/React) |
| **Netlify** | Archivo `public/_redirects` con `/* /index.html 200` |

### Variables de entorno en el pipeline de build

En **cualquier** infraestructura, las variables de `.env.production` deben estar disponibles
**antes** de ejecutar `pnpm build`. Opciones:

- Cargar el `.env.production` real (con valores reales, **no en el repositorio**) en el servidor
- Inyectarlas como variables de entorno del proceso de CI/CD (GitHub Actions, etc.)

```bash
# Ejemplo de build en el servidor:
VITE_API_URL=https://backend.cpee.org.ar/api \
VITE_USE_MOCKS=false \
VITE_ENABLE_LOGS=false \
VITE_WHATSAPP_NUMBER=5493XXXXXXXXX \
pnpm build
```

---

## BLOQUE 5 — Seguridad del repositorio

✅ El proyecto tiene `.gitignore` configurado y los archivos `.env` sensibles están excluidos.

**Verificar que el `.gitignore` incluya:**

```
.env.local
.env.*.local
.env.production
```

> El `.env.example`, `.env.development` y `.env.staging` sí pueden estar en el repositorio
> porque no contienen datos sensibles reales.

---

## BLOQUE 6 — Checklist de pasos para ir a producción

### Fase 1 — Datos institucionales (sin backend)

- [ ] Definir teléfono de consultas real para el Hero de la Home
- [ ] Definir dirección de la sede central para el Hero de la Home
- [ ] Reemplazar los datos en `src/pages/Home/index.tsx` → componente `Hero()`
- [ ] Verificar que `public/logo.jpg` se ve bien en la Navbar (tamaño 32×32 px)
- [ ] Definir número de WhatsApp real y agregarlo a `.env.production`

### Fase 2 — Backend PHP

- [ ] Desarrollar el backend PHP con todos los endpoints listados en el Bloque 2
- [ ] Validar cada contrato JSON con las interfaces en `src/types/index.ts`
- [ ] Definir qué muestra la página "Información Institucional" y crear el endpoint
- [ ] Implementar el proxy de Instagram Graph API en el backend
- [ ] Configurar CORS en el backend según el dominio real del frontend (Bloque 3)

### Fase 3 — Variables de entorno

- [ ] Definir la URL real del backend (`VITE_API_URL`)
- [ ] Actualizar `.env.production` con todos los valores reales
- [ ] Asegurarse de que `.env.production` (con datos reales) **NO está en el repositorio**

### Fase 4 — Infraestructura

- [ ] Decidir dónde se deploya el frontend (Vercel, Netlify, Nginx, cPanel, etc.)
- [ ] Configurar el servidor para manejar el routing de SPA (`try_files` o `_redirects`)
- [ ] Configurar la inyección de variables de entorno en el proceso de build
- [ ] Ejecutar `pnpm build` y verificar que el bundle no tiene errores
- [ ] Subir el contenido de `dist/` al servidor

### Fase 5 — QA pre-lanzamiento

- [ ] Verificar todas las rutas listadas en `README.md` en el entorno de producción
- [ ] Verificar que el botón de Mercado Pago redirige correctamente (endpoint ya implementado)
- [ ] Verificar que el modo sustentable (dark mode) persiste entre sesiones
- [ ] Verificar que los adjuntos en noticias y boletín son descargables
- [ ] Probar en móvil: menú hamburguesa, dropdowns, cards en grilla
- [ ] Verificar que Instagram se oculta correctamente si el array viene vacío
- [ ] Ejecutar `pnpm lint` y confirmar que no hay errores

---

## BLOQUE 7 — Resumen de decisiones abiertas

| # | Decisión | Responsable | Estado |
|---|---|---|---|
| 1 | Teléfono y dirección reales del Hero | Colegio / cliente | ⚠️ PENDIENTE |
| 2 | Número de WhatsApp real | Colegio / cliente | ⚠️ PENDIENTE |
| 3 | Contenido de Información Institucional + endpoint | Backend + cliente | ⚠️ PENDIENTE |
| 4 | Contratos JSON de los 8 endpoints provisionales | Backend | ❌ Sin iniciar |
| 5 | Infraestructura de deploy del frontend | Infraestructura | ❌ Sin definir |
| 6 | Dominio real del backend PHP (VITE_API_URL) | Infraestructura | ❌ Sin definir |
| 7 | Token / configuración de Instagram Graph API | Backend | ❌ Sin iniciar |

