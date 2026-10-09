# Análisis de Seguridad — Frontend (profedes2-frontend)

**Fecha:** 07/10/2026
**Alcance:** Exclusivamente el frontend (`/var/www/html/front`, SPA React 18 + TypeScript + Vite).
**Metodología:** análisis estático de código (SAST manual), inspección del bundle compilado (`dist/`),
auditoría de dependencias (`pnpm audit`), verificación de control de versiones (git) y ejecución
de lint + tests.

> **Nota sobre SQL:** al tratarse de una SPA, **el frontend no ejecuta consultas SQL** (verificado:
> cero sentencias `SELECT/INSERT/UPDATE/DELETE` en `src/`). Toda la persistencia ocurre en el
> backend PHP/PostgreSQL. El riesgo de inyección SQL se evalúa aquí como **vector de entrada**
> (qué datos sin sanitizar envía el front al backend) y se detalla en la sección 3.

---

## 1. Pruebas realizadas

| # | Prueba | Comando / método | Resultado |
|---|--------|------------------|-----------|
| T1 | Búsqueda de inyección SQL en código fuente | `grep -rniE "SELECT|INSERT INTO|DELETE FROM|UPDATE .* SET" src/` | ✅ Sin coincidencias (1 falso positivo: comentario sobre `<select>` HTML) |
| T2 | Búsqueda de primitivas peligrosas (XSS/DOM) | `grep -rn "dangerouslySetInnerHTML\|eval(\|new Function\|innerHTML\|document.write\|sessionStorage" src/` | ⚠️ 1 hallazgo: `dangerouslySetInnerHTML` (XSS, Hallazgo H-02) |
| T3 | Vertido de datos a consola | `grep -rn "console\.(log\|info\|error\|warn)" src/` | ⚠️ 4 hallazgos (H-04, H-08) |
| T4 | Secretos en el bundle de producción | `grep -o "5d6dd9d5[0-9a-f]*" dist/assets/*.js` | ❌ API key literal en `dist/assets/endpoints-CIi1aacP.js` (H-01) |
| T5 | Secretos en git | `git ls-files \| grep env`, `git log --all -- .env`, `git grep "5d6dd9d5"` | ✅ `.env` NO está trackeado ni en historial; solo `.env.example` (sin secretos) |
| T6 | `.gitignore` cubre variables de entorno | inspección de `.gitignore` | ✅ `.env`, `.env.*`, `dist/` ignorados |
| T7 | Auditoría de dependencias | `pnpm audit --prod` | ⚠️ 2 vulnerabilidades moderadas en `react-router` (H-06) |
| T8 | Enlaces externos `target="_blank"` | grep de `target`/`rel` en todas las páginas | ✅ Los 7 usos tienen `rel="noopener noreferrer"` (previene reverse tabnabbing) |
| T9 | Validación de lint | `pnpm lint` | ✅ 0 errores, 1 warning (no relacionado con seguridad) |
| T10 | Tests unitarios | `pnpm test --run` | ✅ 4 archivos, 23 tests pasando |
| T11 | Cabeceras de seguridad / CSP | inspección de `index.html` y `vercel.json` | ❌ Sin CSP, sin `X-Content-Type-Options`, sin `Referrer-Policy` (H-07) |
| T12 | Almacenamiento en navegador | grep de `localStorage`/`sessionStorage`/cookies | ✅ Solo `localStorage('theme')` validado contra `dark|light` (`Navbar.tsx:91,102`); cero `sessionStorage`/cookies |
| T13 | Autenticación / tokens | inspección de `src/api/client.ts`, `src/config/index.ts` | ⚠️ Bearer key estática en el cliente (H-01); no hay JWT ni credenciales de usuario |
| T14 | Interpolación de datos de usuario en URLs | grep de `href={` dinámicos | ⚠️ 8 enlaces con URLs provenientes de la API sin validar protocolo (H-05) |
| T15 | Logs en build de producción | `grep -c "console.info" dist/assets/*.js` | ⚠️ `console.info` de payloads con PII presente en el bundle (H-04) |
| T16 | Formularios con PII | inspección de `Alquileres/index.tsx`, `ObrasSociales/Requisitos.tsx` | ⚠️ Payloads con nombre/email/teléfono/mensaje; aún no se envían (mock `setTimeout`), pero se loguean (H-04) |

---

## 2. Hallazgos

### H-01 — CRÍTICO: API Key expuesta en el bundle del cliente

- **Evidencia:**
  - `src/api/client.ts:31` → `Authorization: \`Bearer ${config.api.apiKey}\``
  - `src/config/index.ts:12` → `apiKey: import.meta.env.VITE_APP_API_KEY`
  - `.env:39` → valor real `5d6dd9d5bf47c294b1a49222930870965bc80bd6b442669df701ee695046ba25`
  - **Confirmado en build:** `dist/assets/endpoints-CIi1aacP.js` contiene la clave en texto plano.
- **Riesgo:** cualquier visitante puede extraer la clave con DevTools o descargando el JS y
  consumir `GET /api/v1/*` sin restricción (enumeración de matriculados, noticias, etc.).
  Si el backend usa la misma clave para endpoints de escritura, el impacto es **exfiltración y
  potencial manipulación de datos**. Las variables `VITE_*` **siempre** quedan expuestas al cliente
  por diseño de Vite.
- **Solución (por orden de recomendación):**
  1. **Mover la autenticación a un proxy/BFF**: el frontend llama a `/api/...` del mismo origen y
     el servidor inyecta la clave (ya reconocido en el propio comentario de `client.ts:21-23`).
  2. Si no es posible, emitir una **clave de solo-lectura** en el backend, distinta de la de
     escritura, con rate-limiting y allowlist de endpoints.
  3. **Rotar la clave actual** (ya quedó expuesta en builds anteriores) y agregar el valor real
     a un gestor de secretos; nunca commitearla (hoy está solo en `.env` local, verificado en T5).
  4. Bloquear en el backend los verbos de escritura para claves de cliente.

### H-02 — ALTO: XSS almacenado vía `dangerouslySetInnerHTML` sin sanitizar

- **Evidencia:** `src/pages/Noticias/NoticiaDetalle.tsx:116`
  ```tsx
  dangerouslySetInnerHTML={{ __html: data.contenido }}
  ```
  El campo `contenido` llega de `GET /novedades/:id` y se inyecta crudo. Irónicamente, sí se
  sanea con regex en la línea 53 (meta description) y en `utils/fileUtils.ts::noticiaResumen`,
  pero **no** antes del render HTML.
- **Riesgo:** si un usuario administrador (o una inyección en BD del backend) logra guardar
  `<img onerror=...>` o `<script>` en una noticia, se ejecuta JS con la sesión/origen de todo
  visitante → robo de datos, phishing, defacement. La regex de stripping no es defensa suficiente.
- **Solución:**
  ```tsx
  import DOMPurify from 'dompurify';
  ...
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.contenido) }}
  ```
  Complementar con **CSP estricta** (ver H-07) y sanitización en el backend al momento de
  guardar el contenido (allowlist de tags HTML: `p, h2-h4, strong, em, ul, ol, li, a, br, img`).

### H-03 — MEDIO: Logging habilitado en producción

- **Evidencia:** `.env:79` → `VITE_ENABLE_LOGS=true`; `src/api/client.ts:63` imprime
  `console.error('[API Error]', apiError, error)` (incluye respuesta cruda del servidor).
  El flag se inyecta en el bundle, por lo que **el build actual produce logs activos**.
- **Riesgo:** filtraje de detalles internos (stack traces, URLs, mensajes de error del backend)
  en DevTools de cualquier usuario; facilita fingerprinting del API.
- **Solución:** usar `import.meta.env.PROD` como guarda:
  ```ts
  if (config.logs.enabled && import.meta.env.DEV) { console.error(...) }
  ```
  y setear `VITE_ENABLE_LOGS=false` en `.env.production`.

### H-04 — MEDIO: PII (datos personales) volcada a consola en los formularios

- **Evidencia:**
  - `src/pages/Alquileres/index.tsx:220` → `console.info('[ConsultaAlquiler] Payload…', JSON.stringify(payload…))`
  - `src/pages/ObrasSociales/Requisitos.tsx:127` → `console.info('[SolicitudObraSocial] Payload…', …)`
  - Verificado en T15: estas llamadas **sobreviven al build** (`dist/assets/Requisitos-swww7K9Q.js`).
- **Riesgo:** nombre, email, teléfono, mensaje y estados de consentimiento (datos personales
  bajo la Ley 25.326 de Protección de Datos Personales de Argentina) quedan visibles en la
  consola de cualquier navegador; combinado con H-08 incrementa el riesgo de exposición.
- **Solución:** eliminar los `console.info` de payloads (o envolverlos en `if (import.meta.env.DEV)`).
  Cuando el endpoint real exista, añadir advertencia en la doc de que el backend debe registrar
  IP + timestamp (ya previsto en `CONSENTIMIENTOS_BACKEND.md`).

### H-05 — MEDIO: Enlaces con URLs de la API sin validar el protocolo (`javascript:`)

- **Evidencia (URLs provenientes del backend insertadas directas en `href`):**
  - `src/pages/Matriculados/Pago.tsx:66` → `href={data.checkoutUrl}`
  - `src/pages/Matriculados/Honorarios.tsx:57` → `href={h.url}`
  - `src/pages/ObrasSociales/index.tsx:205` → `href={obraSocial.url_sitio_web}`
  - `src/pages/Tramites/index.tsx:202` → `href={tramite.enlace}`
  - Además, valores de API interpolados en `tel:`/`mailto:` (ej. `Alquileres/index.tsx:88,93`,
    `Matriculados/Listado.tsx:55,64`): un `contactoEmail` como `x@y.com" onclick="...` no escapa
    (React escapa atributos, por eso el riesgo real es el **protocolo**, no la ruptura de markup).
- **Riesgo:** un campo manipulado a `javascript:alert(document.cookie)` se ejecuta al hacer clic;
  en `checkoutUrl` además habría phishing/redirect a sitios falsos de pago.
- **Solución:** helper de validación usado en todos los `href` dinámicos:
  ```ts
  export const safeHref = (url: string, fallback = '#'): string => {
    try {
      const u = new URL(url, window.location.origin);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) ? url : fallback;
    } catch { return fallback; }
  };
  ```
  Y en el backend: allowlist de dominios para `checkoutUrl` / `url_sitio_web`.

### H-06 — MEDIO: Dependencias con vulnerabilidades conocidas (`react-router`)

- **Evidencia:** `pnpm audit --prod` → 2 advisories moderados:
  - **GHSA-wrjc-x8rr-h8h6** — Open redirect vía backslash en `<Link>`/`useNavigate` (CVE-2025-68470),
    afecta `>=6.0.0 <7.18.0`.
  - **GHSA-337j-9hxr-rhxg** — Inyección de constructor en `deserializeErrors()` (solo aplica a SSR
    hydration; **no explotable** en esta SPA CSR, pero figura en el reporte).
- **Riesgo:** open redirect → phishing (encaminar usuarios a dominios externos).
- **Solución:**
  1. Actualizar: `pnpm up react-router-dom@latest` (mayor: v6 → v7, revisar migración).
  2. Si no se puede migrar ya, mitigar el open redirect validando todo destino que no sea ruta
     interna antes de navegar (`to.startsWith('/') && !to.startsWith('//')`).
  3. Correr `pnpm audit` en CI para detectar regresiones.

### H-07 — BAJO: Ausencia de cabeceras de seguridad y Content-Security-Policy

- **Evidencia:** `index.html` sin `<meta http-equiv="Content-Security-Policy">`;
  `vercel.json` solo tiene rewrites, **sin `headers`**.
- **Riesgo:** sin CSP, un XSS (H-02) ejecuta libremente; sin `X-Content-Type-Options: nosniff`
  un JSON mal tipado podría interpretarse como HTML; sin `Referrer-Policy` se filtra el referrer
  en enlaces externos.
- **Solución** — agregar a `vercel.json`:
  ```json
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://cpee.org.ar; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    }
  ]
  ```
  (Ajustar `connect-src` a la URL real de producción; Vite inyecta scripts inline por lo que
  puede requerir `'unsafe-inline'` en `script-src` o usar hash/nonce.)

### H-08 — BAJO: Configuración de `.env` con valores reales y logs activos

- **Evidencia:** `.env` contiene API key real (H-01), `VITE_API_TIMEOUT`, `VITE_USE_MOCKS=false`,
  `VITE_ENABLE_LOGS=true`. **Verificado que NO está en git** (T5), pero vive en un workspace con
  permisos `rwxrwxrwx`.
- **Riesgo:** cualquier proceso/usuario del servidor puede leerlo; si el directorio se publica por
  error (Apache sirviendo la raíz del proyecto), el `.env` queda expuesto.
- **Solución:** permisos `chmod 600 .env`; servir **solo** `dist/` vía web server; mantener
  `.env.example` como única fuente versionada; usar variables de entorno del servidor/CI para
  builds de producción.

### H-09 — BAJO: Exposición de PII en el endpoint público de matriculados

- **Evidencia:** `src/api/services/matriculadosService.ts` mapea `dni`, `email`, `telefono`,
  `direccion`, `observaciones`, `usuario_abm` del DTO y `Listado.tsx` los renderiza
  (tel/mailto visibles).
- **Riesgo:** scrapeo masivo del padrón (DNI + datos de contacto) con la clave pública (H-01).
  Aunque haya base legal para publicar el matrículado, **DNI y observaciones no deberían salir**
  en un listado público (minimización de datos, art. 4 Ley 25.326).
- **Solución:** pedir al backend un DTO público reducido (`nro_matricula, nombre, apellido,
  localidad, estado`) y reservar DNI/observaciones para un panel autenticado.

### H-10 — INFORMATIVO: Manejo de binarios base64 y data URIs

- **Evidencia:** `src/utils/fileUtils.ts:26` (`atob`), `BoletinOficial/index.tsx:38`,
  `PdfCard.tsx:6` (data URI `application/pdf`), imágenes `data:` desde la API.
- **Riesgo bajo:** un `img_tipo` manipulado a `image/svg+xml` con SVG scripteado podría ejecutar
  JS al cargarse como `<img src>` (los navegadores aíslan SVG en `<img>`, por eso es bajo).
- **Solución:** validar MIME contra allowlist (`image/png|jpeg|webp|gif`) antes de construir la
  data URI; rechazar `image/svg+xml` de origen externo.

---

## 3. Análisis de inyección SQL (vector frontend)

Conclusión de T1: **no hay inyección SQL ejecutable desde el frontend**, porque no hay SQL.
Puntos verificados del flujo de datos que el backend debe blindar:

| Flujo | Estado en el front | Riesgo residual |
|-------|--------------------|-----------------|
| `GET /novedades/:id` | `id` convertido con `parseInt()` (`NoticiaDetalle.tsx:41`) → solo número | Mínimo. Si el backend concatenara el id en SQL crudo, `parseInt` ya lo neutraliza, **pero igual debe usar consultas parametrizadas**. |
| `GET /profesionales`, `/alquileres`, `/obras-sociales`, `/boletines-oficiales` | Paths fijos, sin query params del usuario (`endpoints.ts`) | Ninguno desde el front. |
| Búsqueda de matriculados | **Filtrado 100% en cliente** (`Listado.tsx` + `filterMatriculados`) — nunca viaja al servidor | Ninguno. |
| Formularios (Alquileres / Obras Sociales) | Payloads JSON con strings libres (nombre, email, mensaje); aún no se envían (mock `setTimeout`, `Alquileres/index.tsx:219`) | **Cuando se implemente el POST**, el backend debe: prepared statements/ORM, validación server-side de tipos y longitudes, rate-limit y CAPTCHA. |
| Consentimientos | `useConsentimientos` no persiste en storage (solo estado en memoria) | Ninguno. |

**Recomendaciones al backend (contrato):** parametrizar todos los queries, validar `id` como
entero en el controller, limitar longitud de campos de texto y no reflejar errores SQL crudos
al cliente (el interceptor de `client.ts:52-55` muestra `message` tal cual lo devuelve el server).

---

## 4. Controles que SÍ están bien implementados

- ✅ Cero `eval()`, `new Function()`, `innerHTML` directo, `document.write` y `sessionStorage`.
- ✅ `.env` y `dist/` fuera de git; la API key no aparece en ningún archivo trackeado ni en el
  historial (`git log --all -- .env` vacío).
- ✅ Todos los `target="_blank"` (7 usos) con `rel="noopener noreferrer"` → sin reverse tabnabbing.
- ✅ `localStorage` limitado al tema visual y validado (`Navbar.tsx:91,102`).
- ✅ Sin cookies, sin tokens de sesión, sin credenciales de usuario en el cliente (no hay login).
- ✅ React escapa por defecto todo el render `{...}` → la superficie XSS se reduce al único
  punto de H-02.
- ✅ Validación client-side de formularios (email regex, longitudes) + consentimientos explícitos
  de T&C y privacidad (base legal para los envíos futuros).
- ✅ Interceptor de errores de Axios que normaliza respuestas y no filtra stack traces al usuario.
- ✅ Timeout de 30s en peticiones (`VITE_API_TIMEOUT`) → mitigación de DoS por colgamiento.
- ✅ Enlaces a archivos con `download` + blob URLs generados localmente.
- ✅ `pnpm lint` sin errores y 23/23 tests pasando (sin regresiones introducidas).

---

## 5. Plan de remediación priorizado

| Prioridad | Hallazgo | Acción | Esfuerzo |
|-----------|----------|--------|----------|
| P0 (inmediato) | H-01 | Rotar API key; implementar proxy/BFF o clave de solo-lectura con rate-limit | Alto |
| P0 (inmediato) | H-02 | Sanitizar `contenido` con DOMPurify antes de renderizar | Bajo |
| P1 (esta semana) | H-06 | `pnpm up react-router-dom@latest` + revisar migración a v7 | Medio |
| P1 | H-04 | Eliminar `console.info` de payloads con PII | Bajo |
| P1 | H-03 | Forzar logs off en producción (`import.meta.env.DEV`) | Bajo |
| P2 | H-05 | Helper `safeHref()` en los 8 `href` dinámicos | Bajo |
| P2 | H-07 | Cabeceras de seguridad + CSP en `vercel.json` | Medio |
| P2 | H-09 | DTO público sin DNI/observaciones | Medio (backend) |
| P3 | H-08, H-10 | `chmod 600 .env`, allowlist de MIME types | Bajo |

---

## 6. Anexo — comandos ejecutados

```bash
# T1 / T2 / T3 / T12 / T14 — greps de análisis estático
grep -rni "SELECT \|INSERT INTO\|DELETE FROM\|UPDATE .* SET" src/
grep -rn "dangerouslySetInnerHTML\|eval(\|new Function\|innerHTML\|document.write\|sessionStorage" src/
grep -rn "console\.\(log\|info\|error\|warn\)" src/
grep -rn "localStorage\|sessionStorage" src/
grep -rn "href={" src/

# T4 — secretos en el build
grep -o "5d6dd9d5[0-9a-f]*" -r dist/assets/*.js

# T5 / T6 — secretos en git
git ls-files | grep -i env
git log --all --oneline -- .env
git grep -l "5d6dd9d5"
cat .gitignore

# T7 — dependencias
pnpm audit --prod
# → 2 vulnerabilities found. Severity: 2 moderate (react-router)

# T9 — lint
pnpm lint
# → 0 errors, 1 warning (react-refresh)

# T10 — tests
pnpm test --run
# → 4 test files, 23/23 passed
```

**Fecha del análisis:** 07/10/2026 · **Analista:** revisión automatizada + revisión manual de código.

---

## 7. Guía de implementación de las remediaciones

Esta sección convierte los hallazgos anteriores en tareas concretas e indica el orden de
implementación, los archivos o componentes involucrados y cómo verificar cada cambio. Las rutas
del frontend se refieren a este repositorio. El código del backend PHP y su despliegue no forman
parte de este repositorio, así que los nombres de controladores y rutas de servidor deben
confirmarse con el equipo backend.

### 7.1. H-01 — Retirar la API key del navegador y corregir el modelo de acceso

**Objetivo:** que ninguna credencial privilegiada o considerada secreta se envíe desde el bundle
público. Una variable `VITE_*` no puede protegerse: Vite la sustituye al compilar.

**Pasos:**

1. **Backend/operaciones — revocar primero la clave actual.** Rotar la credencial expuesta y
   revisar los logs de acceso para detectar uso inusual. Confirmar qué permisos tenía: el riesgo
   es crítico si permitía escritura o acceso privilegiado; si sólo daba acceso a datos públicos,
   no deja de estar expuesta, pero el impacto debe describirse de acuerdo con esos permisos.
2. **Acordar el contrato antes de cambiar el cliente.** Determinar si los endpoints son realmente
   públicos o requieren identidad/autorización. No sustituir la clave por otra incluida en el
   bundle ni considerar una clave de “solo lectura” del navegador como un secreto.
3. **Backend — si se necesita una credencial de servidor, implementar un BFF/proxy de mismo
   origen.** Guardar el secreto en el gestor de secretos del servidor o del entorno de despliegue.
   Exponer sólo las rutas y métodos que necesita la SPA, validar parámetros y no crear un proxy
   arbitrario que acepte URLs o métodos elegidos por el cliente. Aplicar autorización en cada
   operación, límites de tasa y respuestas de error controladas. Si el BFF usa una sesión basada
   en cookies, configurar `Secure`, `HttpOnly` y `SameSite` y añadir protección CSRF adecuada.
4. **Frontend — actualizar la configuración en `src/config/index.ts`.** Retirar el uso de
   `VITE_APP_API_KEY` y la propiedad `config.api.apiKey`. Mantener únicamente configuración que
   sea pública, como la URL base necesaria para llamar al BFF.
5. **Frontend — actualizar `src/api/client.ts`.** Eliminar el header `Authorization` estático y
   dirigir las peticiones a las rutas del BFF, idealmente relativas al mismo origen. Si el backend
   determina que algunos endpoints son públicos y no necesitan BFF, documentar esa decisión y
   consumirlos sin presentar una clave embebida como mecanismo de autenticación.
6. **Entornos y despliegue.** Retirar la variable de los entornos de build del frontend y
   conservar secretos sólo en el runtime del servidor/BFF. Revisar builds ya publicados y CDN/
   cachés; limpiar versiones accesibles si corresponde. La eliminación del valor de `.env` local
   no revoca una clave que ya se expuso.
7. **Verificación.** Compilar para producción y comprobar que la clave y el header Bearer no
   aparecen en `dist/`. Probar en el navegador que cada endpoint necesario sigue funcionando,
   que rutas no autorizadas se rechazan y que rate limiting/autorización se aplican en backend.

**Criterio de cierre:** no hay credenciales de servidor en el bundle ni en variables `VITE_*`;
la clave anterior está revocada y el cliente sólo puede invocar operaciones expresamente
permitidas.

### 7.2. H-02 — Sanitizar el contenido HTML de noticias

**Objetivo:** impedir ejecución de contenido no confiable tanto al mostrar noticias como al
guardarlas o editarlas.

**Pasos:**

1. **Frontend — dependencia.** Añadir DOMPurify y, si el proyecto lo requiere por TypeScript,
   sus tipos de acuerdo con las versiones disponibles y las convenciones del package manager.
2. **Frontend — render en `src/pages/Noticias/NoticiaDetalle.tsx`.** Sanitizar
   `data.contenido` inmediatamente antes de pasarlo a `dangerouslySetInnerHTML`. Definir una
   allowlist explícita y mínima de etiquetas y atributos necesaria para el contenido editorial.
   Permitir sólo protocolos de enlace seguros; no permitir handlers `on*`, scripts, iframes,
   estilos arbitrarios ni URLs `javascript:`/`data:`. No usar regex de stripping como sustituto
   de un sanitizador HTML.
3. **Frontend — vista previa y otros puntos de render.** Buscar otras inserciones de HTML de
   noticias o contenido remoto y aplicar el mismo criterio compartido, sin crear políticas
   divergentes. El texto usado para meta description debe extraerse como texto y limitarse en
   longitud, pero no reemplaza la sanitización del HTML visible.
4. **Backend — guardar y servir noticias.** En el controlador/servicio que crea o actualiza
   novedades, validar y sanitizar el contenido con una allowlist equivalente. Restringir las
   operaciones de edición a roles autorizados y revisar el contenido histórico ya almacenado.
   El backend no debe confiar en que el navegador lo haya sanitizado.
5. **Verificación.** Añadir pruebas para HTML legítimo que debe conservar formato y cargas
   maliciosas con `<script>`, atributos `onerror`, enlaces `javascript:`, SVG/MathML e iframes.
   Probar también artículos antiguos y contenido vacío. Confirmar en navegador que el texto
   malicioso se muestra como texto o se elimina, pero nunca se ejecuta.

**Criterio de cierre:** el cliente y el servidor aplican allowlists definidas; sólo roles
autorizados pueden modificar contenido y las pruebas negativas no ejecutan scripts.

### 7.3. H-03 y H-04 — Eliminar logs con información sensible

**Objetivo:** no registrar PII, credenciales, respuestas crudas ni detalles internos en consola.

**Pasos:**

1. **Frontend — formularios.** En
   `src/pages/Alquileres/index.tsx` y
   `src/pages/ObrasSociales/Requisitos.tsx`, retirar los `console.info` que serializan el
   payload. Actualmente esos formularios simulan el envío; al conectar los POST reales, no
   registrar el payload completo ni siquiera en desarrollo.
2. **Frontend — cliente HTTP.** En `src/api/client.ts`, dejar de imprimir `error` de Axios y la
   respuesta completa. Si se necesita diagnóstico de desarrollo, registrar sólo información
   no sensible (por ejemplo, código de estado y un identificador de correlación), detrás de
   una condición explícita de desarrollo. No registrar headers, tokens, cuerpos ni datos
   personales.
3. **Frontend — errores globales.** Revisar
   `src/components/common/AppErrorBoundary.tsx`, que también registra errores y `errorInfo`.
   Evitar que mensajes, componentes o datos del usuario terminen en consola. Si se integra un
   servicio de monitoreo, definir redacción de PII y acceso restringido a esos eventos.
4. **Configuración.** Dejar `VITE_ENABLE_LOGS` desactivado para builds de producción y no
   depender sólo de una variable configurable para proteger PII: los registros de payloads se
   deben eliminar. `import.meta.env.DEV` puede limitar diagnósticos técnicos no sensibles.
5. **Backend.** Responder errores con mensaje genérico y código estable; no enviar stack traces,
   SQL, rutas internas ni secretos. Los logs de servidor deben minimizar PII, restringir acceso
   y definir retención. Para soporte, registrar identificador de correlación en vez del cuerpo
   completo de la solicitud.
6. **Verificación.** Buscar `console.*` en `src/`, inspeccionar el bundle de producción y probar
   errores de red/servidor. Confirmar que no aparece el nombre, email, teléfono, mensaje,
   consentimiento, token ni respuesta cruda.

**Criterio de cierre:** los payloads con PII no se escriben en consola ni se envían a sistemas
de logging sin redacción y controles definidos.

### 7.4. H-05 — Validar URLs provenientes de la API

**Objetivo:** permitir únicamente destinos esperados, y evitar protocolos ejecutables o
redirecciones a hosts no autorizados en operaciones sensibles.

**Pasos:**

1. **Frontend — crear una utilidad común en `src/utils/`.** Recibir el valor de URL y devolver
   una URL validada o `null`. Parsear con `URL`, aceptar `https:` por defecto y aceptar `http:`
   sólo para casos justificados. Rechazar `javascript:`, `data:`, `vbscript:`, valores mal
   formados y protocolos no contemplados.
2. **Frontend — aplicar la utilidad en enlaces remotos.** Revisar como mínimo
   `src/pages/ObrasSociales/index.tsx` (`url_sitio_web`),
   `src/pages/Tramites/index.tsx` (`tramite.enlace`),
   `src/pages/Matriculados/Honorarios.tsx` (`h.url`) y
   `src/pages/Matriculados/Pago.tsx` (`checkoutUrl`). Renderizar el enlace sólo si la utilidad
   devuelve una URL válida. Mantener `rel="noopener noreferrer"` en enlaces con
   `target="_blank"`.
3. **Checkout — allowlist de hosts.** Para `checkoutUrl`, permitir sólo los dominios oficiales
   acordados con el proveedor de pago y backend. La validación del esquema sola no impide un
   destino HTTPS fraudulento.
4. **Frontend — HTML de noticias y medios.** Aplicar restricciones equivalentes a `href`/`src`
   dentro del HTML sanitizado y a URLs de imágenes remotas. No asumir que validar el enlace
   exterior sanea URLs embebidas.
5. **Backend.** Validar y normalizar URLs al ingresarlas y al serializarlas en la API. Para
   pagos, construir o validar la URL contra los hosts legítimos del proveedor; no aceptar una
   URL de checkout arbitraria del cliente.
6. **Verificación.** Probar URLs HTTPS permitidas, hosts no permitidos, URL relativa si no está
   contemplada, valor vacío y protocolos `javascript:`, `data:` y `vbscript:`. Confirmar que
   valores inválidos no generan enlace clickeable.

### 7.5. H-06 — Resolver las alertas de dependencias

**Objetivo:** actualizar sólo los paquetes afectados por advisories aplicables, sin introducir
una migración mayor innecesaria.

**Pasos:**

1. Volver a ejecutar la auditoría del lockfile actual y guardar los identificadores de advisory,
   versiones afectadas, alcance (producción/desarrollo) y versiones corregidas.
2. Revisar si la versión de `react-router` instalada está dentro del rango vulnerable y si el
   advisory afecta funcionalidades usadas por esta SPA.
3. Actualizar a la versión corregida compatible dentro de la versión mayor actual cuando sea
   posible. Si sólo hay corrección en una versión mayor, revisar changelog y migración antes de
   actualizar.
4. Ejecutar tests, lint y build; probar navegación directa, rutas anidadas, parámetros, enlaces
   atrás/adelante y carga de rutas lazy.
5. Repetir auditoría y registrar el resultado. No considerar resuelto el hallazgo sólo porque
   `pnpm up ...@latest` haya terminado sin error.

### 7.6. H-07 — Desplegar cabeceras de seguridad y CSP

**Objetivo:** incorporar defensa en profundidad sin bloquear recursos legítimos ni usar una CSP
permisiva que anule su propósito.

**Pasos:**

1. **Identificar el servidor efectivo.** Determinar si producción se sirve desde Vercel, otro
   CDN, Nginx/Apache o una combinación. Configurar las cabeceras en el punto que entrega la SPA;
   un cambio en `vercel.json` sólo sirve si ése es el despliegue activo.
2. **Agregar cabeceras no controvertidas** en la configuración de despliegue: `X-Content-Type-
   Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y protección contra
   framing mediante CSP `frame-ancestors 'none'` o `X-Frame-Options: DENY`, considerando si
   existe una necesidad legítima de embeber la aplicación.
3. **Preparar CSP en modo reporte.** Empezar con `Content-Security-Policy-Report-Only`, inventariar
   scripts, estilos, fuentes, imágenes, conexiones API y pagos que necesita la app y recopilar
   violaciones sin datos sensibles.
4. **Definir directivas restrictivas.** Empezar con `default-src 'self'`; definir explícitamente
   `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `object-src 'none'`,
   `base-uri 'self'` y `frame-ancestors`. Incluir sólo orígenes requeridos. Preferir nonces o
   hashes para scripts inline; no añadir `'unsafe-inline'` a `script-src` como solución rápida.
   Las políticas de estilo pueden requerir tratamiento separado según Tailwind y cómo se
   generen los estilos.
5. **Aplicar en modo obligatorio gradualmente.** Resolver violaciones legítimas, desplegar en
   staging, verificar formularios, API, fuentes, imágenes, mapas/pagos si existen, y luego pasar
   a `Content-Security-Policy`. Mantener monitoreo tras el despliegue.
6. **HSTS.** Añadir `Strict-Transport-Security` sólo en el dominio servido por HTTPS y activar
   `includeSubDomains` únicamente cuando todos los subdominios estén preparados para HTTPS.
7. **Verificación.** Comprobar cabeceras en la respuesta HTTP real de producción y confirmar que
   el navegador no bloquea recursos legítimos. `frame-ancestors` debe ser una cabecera HTTP;
   no confiar en una etiqueta `meta` para esa directiva.

### 7.7. H-08 — Proteger secretos y artefactos de despliegue

**Pasos:**

1. Confirmar que `.env` continúa fuera de git y que no se incluye en el artefacto de despliegue.
   La revisión original indica que no estaba trackeado; esa comprobación debe repetirse en el
   entorno y rama usados para desplegar.
2. Configurar el `document root` para servir sólo los archivos estáticos generados, no la raíz
   del repositorio ni archivos de configuración. Denegar explícitamente acceso web a `.env`,
   `.git`, archivos de lock/configuración y backups.
3. Guardar variables sensibles sólo en el gestor de secretos de CI/servidor. No pasar la clave
   privada a variables `VITE_*`, pues acabaría en los assets compilados.
4. Restringir permisos locales del archivo de entorno a la cuenta/usuarios necesarios. Esto es
   una protección local complementaria, no sustituye rotación, almacenamiento seguro ni
   configuración correcta del servidor.
5. Verificar desde fuera del servidor que las rutas `.env`, `.git` y archivos de configuración
   no son accesibles, y que el bundle no contiene valores secretos.

### 7.8. H-09 — Minimizar datos del padrón público

**Objetivo:** que la respuesta pública contenga sólo los datos indispensables para verificar la
matrícula, no simplemente ocultar campos en la interfaz.

**Pasos:**

1. **Backend — inspeccionar la respuesta real** de `GET /api/v1/profesionales` y documentar
   campos, paginación, uso y clasificación de cada dato. Confirmar si DNI, email, teléfono,
   domicilio, observaciones o usuario interno realmente se devuelven a visitantes anónimos.
2. **Definir el DTO público** con el responsable de privacidad/institucionalidad. Como punto de
   partida, evaluar matrícula, nombre/apellido, localidad y estado profesional; publicar
   teléfono/email sólo si hay finalidad y base legal aprobadas. Excluir DNI, domicilio,
   observaciones, `usuario_abm`, timestamps internos y cualquier otro dato innecesario.
3. **Backend — cambiar el mapper/controlador del recurso profesionales** para construir ese DTO
   explícitamente, en vez de serializar el modelo o reutilizar un DTO administrativo. Aplicar
   autorización separada a cualquier endpoint administrativo que necesite más campos.
4. **Frontend — actualizar `ProfesionalDto` y `Matriculado`** en
   `src/api/services/matriculadosService.ts` y `src/types/index.ts` para que representen sólo el
   contrato público. Actualizar `src/pages/Matriculados/Listado.tsx` según los campos que el
   contrato finalmente autorice; borrar email/teléfono de tarjetas si no están aprobados.
5. **Datos existentes y cachés.** Si el endpoint estuvo exponiendo campos que ya no deben ser
   públicos, invalidar cachés/CDN según corresponda y revisar logs/retención de copias conforme
   al procedimiento de privacidad aplicable.
6. **Verificación.** Añadir pruebas de contrato del backend que aseguren que campos prohibidos
   no se serializan, y pruebas del cliente con el DTO público nuevo. Revisar la respuesta de red
   como visitante, no sólo la vista renderizada.

### 7.9. H-10 — Validar MIME y tamaño de archivos

**Pasos:**

1. En `src/utils/fileUtils.ts`, antes de convertir base64 a blob/data URI, comprobar que el MIME
   pertenece a una allowlist concreta para cada uso. Separar imágenes de documentos; no aceptar
   SVG remoto salvo que exista una necesidad explícita y un proceso seguro de sanitización.
2. Definir límites de tamaño y rechazar datos malformados antes de decodificarlos para reducir
   consumo excesivo de memoria. No confiar exclusivamente en el MIME indicado por el backend:
   validar también al subir/almacenar en backend y configurar `Content-Type` correcto.
3. Probar tipos permitidos, MIME desconocido, SVG, contenido vacío/corrupto y archivos que
   excedan tamaño. Confirmar que el rechazo produce un estado/error visible acorde al patrón de
   la aplicación, no un fallback que parezca una carga correcta.

**Precisión del riesgo:** el análisis no confirma que SVG servido dentro de un `<img>` sea un
vector de ejecución de JavaScript fiable en navegadores modernos. Esta medida se recomienda por
validación de contenido y reducción de superficie, no como afirmación de XSS explotable ya
demostrado.

### 7.10. Validaciones del backend relacionadas con SQL y formularios

Aunque la SPA no ejecuta SQL, todo dato debe validarse en el servidor porque las validaciones del
cliente se pueden omitir.

1. Validar `id` y demás parámetros en el controlador backend como enteros/rangos esperados y
   rechazar valores inválidos con un error controlado.
2. Usar consultas parametrizadas o el ORM para todas las operaciones. No concatenar IDs,
   filtros ni strings de formularios dentro de SQL.
3. Al implementar los POST que hoy son mocks en alquileres y obras sociales, validar en backend
   tipos, longitudes, formato de email/teléfono, identificadores de recursos y consentimiento.
   Limitar tamaño de request y frecuencia de envío; usar controles antiabuso proporcionales.
   CAPTCHA es opcional según evidencia de abuso, no reemplaza validación ni rate limiting.
4. No devolver mensajes SQL, trazas ni excepciones internas. Responder con código de error
   estable y texto público genérico; incluir un identificador de correlación para soporte.
5. Añadir tests de backend para entradas inválidas, límites, autorización, consultas y forma de
   la respuesta. En el cliente, mantener validación para UX, pero no tratarla como control de
   seguridad.

### 7.11. Orden de despliegue y criterios generales de aceptación

| Fase | Trabajo | Dependencias |
|------|---------|--------------|
| 1 | Revocar la clave comprometida y revisar permisos/actividad | Backend y operaciones |
| 2 | Acordar API pública frente a BFF; implementar y desplegar el contrato del servidor | Backend; coordinar cambio de cliente |
| 3 | Actualizar cliente para retirar la clave estática sin interrumpir endpoints necesarios | Fase 2 |
| 4 | Sanitizar noticias en servidor y cliente; retirar logs de PII | Coordinación frontend/backend |
| 5 | Definir DTO público de matriculados y actualizar contrato de frontend | Aprobación de datos y backend |
| 6 | Validar URLs, MIME, tamaños y entradas; cubrir con pruebas | Frontend/backend según el límite |
| 7 | Resolver advisory de dependencias y desplegar cabeceras/CSP gradualmente | Staging y pruebas de despliegue |
| 8 | Verificar bundle, respuestas de API, logs y cabeceras en producción; monitorear regresiones | Todas las fases |

No cerrar una tarea sólo porque los datos dejaron de mostrarse en pantalla: comprobar también
bundle compilado, requests/respuestas HTTP, permisos de endpoint y artefactos del despliegue.
La severidad de la API key y la exposición efectiva de PII deben confirmarse revisando el backend;
el presente análisis del frontend no determina por sí solo esos permisos ni el contenido real
servido a cada tipo de usuario.
