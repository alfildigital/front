# Configuración y diagnóstico de reCAPTCHA

## Qué estaba impidiendo el flujo

- El frontend no tenía configurada `VITE_RECAPTCHA_SITE_KEY`; sin esa clave pública, la página no puede pedir a Google que muestre el widget.
- La ruta del frontend (`/profesionales/reportes_pagos`) no coincidía con la ruta que ya tenía el backend (`/profesionales/solicitar-detalle-pagos`).
- El método del backend respondía correctamente, pero aceptaba la solicitud sin validar el token CAPTCHA.

## Configuración requerida

Se usan claves de **reCAPTCHA v2 con casilla de verificación**. La clave pública y la clave secreta deben pertenecer al mismo registro de Google reCAPTCHA; autorizá en ese registro los dominios donde se publica el frontend.

### Frontend

En el archivo de entorno usado por Vite para cada despliegue (por ejemplo, `.env.local` en desarrollo o `.env.production` en producción), configurá:

```dotenv
VITE_RECAPTCHA_SITE_KEY=clave_publica_del_sitio
```

La clave pública se incluye en el JavaScript del navegador, por lo que no es un secreto. Para producción, configurá estas variables en la plataforma que compila/despliega el frontend; el `.env` local no se publica automáticamente:

```dotenv
VITE_RECAPTCHA_SITE_KEY=clave_publica_del_sitio
VITE_API_URL=https://gestion.colegioedespecial.org.ar/cpee/api/v1
VITE_APP_API_KEY=clave_de_acceso_a_la_api
```

Después de cambiar variables, reiniciá Vite en desarrollo o volvé a construir y desplegar el frontend en producción. La página de consulta está en `src/pages/Matriculados/Informacion.tsx`.

La clave debe estar disponible en el entorno que ejecuta `pnpm build`; el `.env` de una máquina local no se copia automáticamente al servidor ni al pipeline. Si la página muestra **“El CAPTCHA no está configurado”**, el bundle publicado se construyó sin `VITE_RECAPTCHA_SITE_KEY`: definí la variable en el entorno de build y volvé a compilar y desplegar. El build de producción ahora falla explícitamente si falta esta variable.

Para desarrollo local con este backend alojado como `/cpee_back`, usá como `VITE_API_URL`:

```dotenv
VITE_API_URL=http://localhost/cpee_back/public/index.php?url=api/v1
```

El `.env` local del backend debe tener `APP_ENV=development` para permitir los orígenes `http://localhost:5173` y `http://127.0.0.1:5173`. No uses ese modo en producción.

### Backend

En el archivo `.env` del backend, configurá la clave secreta de ese mismo registro:

```dotenv
RECAPTCHA_SECRET_KEY=clave_secreta
```

No uses prefijo `VITE_` para la clave secreta y no la copies al repositorio ni al frontend. El endpoint la utiliza para verificar cada token con `https://www.google.com/recaptcha/api/siteverify`. Si falta o Google no está disponible, el endpoint devuelve un error y no acepta la solicitud.

## Cambios realizados

1. `src/config/index.ts`: elimina espacios de la clave pública y usa una cadena vacía cuando no está configurada.
2. `src/api/endpoints.ts`: alinea la URL de envío del frontend con la ruta `POST /api/v1/profesionales/solicitar-detalle-pagos` que resuelve `cpee_back/public/index.php`.
3. `src/pages/Matriculados/Informacion.tsx`: muestra una guía breve cuando Google no carga el widget.
4. `cpee_back/app/Controllers/Api/ProfesionalesController.php`: valida el formato del DNI, requiere un token, lo verifica con Google usando `RECAPTCHA_SECRET_KEY` y devuelve errores explícitos si no es válido o no puede verificarse. La verificación usa el cliente HTTP nativo de PHP con timeout.
5. `.env.example` y `README.md`: aclaran qué clave va en cada aplicación y enlazan esta guía.

## Comprobación y diagnóstico

1. Abrí `/matriculados/informacion` y el formulario de solicitud. Si falta la clave pública, la página indica que el CAPTCHA no está configurado.
2. Si la clave está configurada pero el widget no aparece, revisá la consola y la pestaña **Network** del navegador: la carga de `https://www.google.com/recaptcha/api.js?render=explicit` debe completarse. Verificá bloqueadores de scripts, conectividad y que el dominio del sitio esté autorizado en Google.
3. Completá el CAPTCHA y enviá una solicitud. Una clave secreta faltante se reporta como error de configuración del servidor; un token rechazado debe completarse de nuevo.
4. Confirmá que la petición se envíe a `/api/v1/profesionales/solicitar-detalle-pagos`, no a `/reportes_pagos`.
5. En producción, verificá que la compilación use el dominio real del backend en `VITE_API_URL`, no `localhost`, y que se haya desplegado después de configurar las variables.
6. Si el POST responde **405**, publicá también la versión del backend que incluye la ruta en `public/index.php` y la validación en `app/Controllers/Api/ProfesionalesController.php`; configurar la clave secreta por sí solo no agrega la ruta.

La verificación CAPTCHA no reemplaza la lógica funcional de la solicitud: el endpoint actual confirma la recepción, pero no busca los pagos ni envía un correo.
