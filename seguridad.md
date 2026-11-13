# Revisión de seguridad del frontend

## Resumen ejecutivo

Se identificó un riesgo de severidad media: la documentación recomienda configurar `VITE_APP_API_KEY`, y el cliente Axios envía ese valor como `Authorization: Bearer` en todas las solicitudes. Las variables `VITE_*` quedan incorporadas en el código público del navegador; por lo tanto, esa clave no debe considerarse secreta.

Durante el seguimiento se encontró un valor de API key en el `.env` local, que no aparece entre los archivos versionados. No se validó si sigue activo. Tratarlo como expuesto y rotarlo; no incluirlo en este documento, en el bundle ni en logs.

No se confirmó una vulnerabilidad de inyección SQL en el frontend. El procesamiento de SQL corresponde al backend. Una inspección estática posterior encontró que `ProfesionalesController::reportesPagos()` llama a la verificación de CAPTCHA del servidor, pero no se probó su funcionamiento en ejecución ni se auditó exhaustivamente el backend.

## Hallazgos

| # | Severidad | Archivo | Ubicación | Vulnerabilidad | Confianza |
|---|-----------|---------|-----------|----------------|-----------|
| 1 | 🟡 MEDIUM | `recaptcha.md` y `src/api/client.ts` | `recaptcha.md:23-27`; `src/api/client.ts:25-32` | Se recomienda una credencial reutilizable en `VITE_APP_API_KEY`; el cliente la envía como Bearer en todas las solicitudes. El valor puede extraerse del bundle del navegador y usarse directamente contra la API. El impacto depende de los permisos que el backend conceda a esa clave. | 9/10 |

### Correcciones prioritarias

1. **No incluir credenciales reutilizables en variables `VITE_*`.** Mover la credencial al servidor, por ejemplo detrás de un backend-for-frontend (BFF) o proxy controlado. Aplicar autorización en el backend para cada operación; no confiar en las restricciones de la interfaz.
2. **Rotar la clave** encontrada en el `.env` local y cualquier clave que se haya usado en builds o despliegues públicos. Revisar permisos y registros de uso. No borrar ni reemplazar el `.env` local sin coordinarlo con quien administra ese entorno.
3. **Conservar y probar la validación del CAPTCHA en el servidor.** La inspección estática encontró la verificación en el endpoint de reportes de pago; confirmar mediante pruebas de integración que tokens inválidos se rechazan.

## Plan de remediación recomendado: BFF del lado servidor

Esta es una propuesta de implementación; **no se modificó código para realizarla**. Retirar el header solamente del frontend no es una corrección funcional: `ApiController::requireAuth()` exige Bearer en las rutas REST y las solicitudes fallarían con 401.

### Backend (`/var/www/html/cpee_back`)

1. **Mantener `API_API_KEY` exclusivamente en el entorno del servidor**, en el `.env` del backend o en el gestor de secretos de despliegue. No usar prefijo `VITE_` para secretos. Rotar la clave actual antes de volver a desplegar.
2. **Crear una capa BFF con rutas explícitas** en `app/Controllers/Api/` y conectarlas al enrutador de `public/index.php`. Exponer únicamente las operaciones que necesita el sitio público. No crear un proxy genérico que acepte una URL, método o destino arbitrario del cliente.
3. **Limitar cada operación** por método HTTP, recurso, parámetros y campos de respuesta. El BFF debe invocar la lógica de servidor directamente o hacer una llamada interna con la clave leída desde el entorno del backend. La clave no debe volver en la respuesta ni en mensajes de error.
4. **Preservar la protección de las rutas existentes.** No quitar globalmente `requireAuth()` ni habilitar sin restricciones todos los recursos. Para el envío de reportes, conservar la validación del DNI, el CAPTCHA del lado servidor y agregar límites de frecuencia/abuso apropiados para una operación pública.
5. **Mantener CORS restringido** a los orígenes reales del sitio y responder solo a los métodos y headers requeridos por el BFF.

### Frontend (`/var/www/html/front`)

1. En `src/api/client.ts`, quitar el header Bearer y toda referencia a `VITE_APP_API_KEY`.
2. En `src/config/index.ts`, retirar la propiedad `apiKey` si no tiene otros consumidores.
3. En `.env.example`, eliminar `VITE_APP_API_KEY` y su instrucción de configuración. Dejar `VITE_API_URL` como dirección pública del BFF; su valor no es secreto.
4. Actualizar `recaptcha.md`, `README.md`, `CONEXION_FRONT_BACKEND.md`, `GUIA_FLUJO_NAVEGACION.md` y `src/docs/DECISIONES.md` para no pedir ni documentar una clave secreta en el cliente.
5. Reconstruir y desplegar el frontend después de la rotación; retirar bundles antiguos que incluyan la credencial.

### Verificación de la corrección

- Ejecutar build, lint y pruebas del frontend y backend.
- Revisar el panel Network del navegador y confirmar que las solicitudes al BFF no contienen la clave Bearer del backend.
- Comprobar que la clave no aparece en los assets generados. Usar una clave canario de prueba para esa comprobación; nunca imprimir ni copiar la clave real en comandos o logs.
- Probar que el BFF permite únicamente métodos/rutas definidos y rechaza destinos o parámetros no permitidos.
- Confirmar que las rutas backend que siguen siendo privadas devuelven 401 sin autenticación.
- Probar en integración que un CAPTCHA inválido es rechazado y que un token válido permite el flujo esperado.
- Verificar límites de frecuencia, CORS y que las respuestas del BFF no filtren campos internos.

## Inyección SQL

No se encontró construcción de consultas SQL en el código frontend revisado. El formulario envía el DNI y el token CAPTCHA como JSON; no se puede concluir desde el frontend cómo esos valores se procesan después. Para prevenir SQL injection, el backend debe validar los datos y usar consultas parametrizadas. No se auditó el procesamiento de SQL en el backend.

## Otras observaciones que requieren seguimiento

- Se encontró `dangerouslySetInnerHTML` en `src/pages/Noticias/NoticiaDetalle.tsx:122`, fuera de los cambios inspeccionados. No se evaluó el origen del HTML ni su sanitización; esto **no constituye un hallazgo confirmado** en esta revisión. Revisar el flujo y asegurar que contenido no confiable se sanitice antes de insertarlo en el DOM.
- La inspección estática de seguimiento observó que `reportesPagos()` verifica el CAPTCHA en servidor y que `requireAuth()` protege las rutas REST. No se ejecutaron pruebas para confirmar esos controles ni se revisaron exhaustivamente las políticas de autorización.

## Pruebas y procedimientos realizados

La revisión fue estática; no se ejecutaron pruebas dinámicas ni solicitudes a servicios. Los procedimientos realizados fueron:

1. Comprobar el estado del repositorio con `git status`; se reportó limpio.
2. Inspeccionar la diferencia `main...HEAD` de la rama `44-credenciales`; se reportaron 11 archivos, incluyendo la documentación del CAPTCHA, cliente API, configuración Vite, endpoints y `.env.example`.
3. Buscar en `src` y archivos de configuración referencias a almacenamiento (`localStorage`, `sessionStorage`, cookies), renderizado/ejecución dinámica (`dangerouslySetInnerHTML`, `innerHTML`, `eval`), solicitudes (`fetch`, Axios), autenticación y URLs.
4. Inspeccionar el formulario modificado: DNI y token CAPTCHA se envían como JSON; el error se representa como texto de React, no como HTML.
5. Inspeccionar `package.json` y las secciones de importadores del lockfile.

### No realizado / límites

- No se ejecutaron pruebas automatizadas, build, análisis de dependencias ni comprobaciones de advisories.
- No se realizaron solicitudes HTTP, pruebas de penetración ni verificaciones contra servicios externos.
- No se auditó exhaustivamente el backend ni se verificaron operativamente los controles de autorización, CAPTCHA o consultas SQL. Para proponer el plan anterior se inspeccionaron estáticamente `app/Controllers/Api/ApiController.php`, `app/Controllers/Api/ProfesionalesController.php` y el enrutador `public/index.php`.
- El análisis de dependencias se limitó a `package.json` y las secciones de importadores del lockfile; no cubrió advisories ni todas las dependencias transitivas.
- El alcance principal fue la diferencia `main...HEAD`, no una auditoría exhaustiva de todo el frontend. Las observaciones fuera de esos cambios, como el uso de `dangerouslySetInnerHTML`, requieren revisión específica.
- En el seguimiento se buscaron referencias a `VITE_APP_API_KEY` y `API_API_KEY` en el frontend y el código PHP, y se consultó `git ls-files` para `.env` y `.env.*`; el `.env` local no está versionado. No se comprobó si la clave es válida ni se copió su valor al informe.
