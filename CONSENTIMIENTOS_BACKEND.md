# Consentimientos Legales — Contrato de API y Backend

Documento técnico que especifica los cambios necesarios en el backend para registrar
los consentimientos legales de los usuarios.

**Fecha:** 2025-01-01  
**Versión del documento:** 1.0  
**Estado:** Pendiente de implementación en backend

---

## Contexto

El frontend (`src/`) fue actualizado para incluir:

- Páginas independientes de Términos y Condiciones (`/terminos-y-condiciones`) y Política de Privacidad (`/politica-de-privacidad`)
- Modal reutilizable para visualizar documentos legales sin abandonar el formulario
- Checkbox de aceptación obligatoria de T&C y Política de Privacidad
- Checkbox opcional de consentimiento de marketing

Los dos formularios que envían datos al backend ahora incluyen el objeto `consentimientos`
en su payload. El backend debe procesarlo y registrarlo.

---

## Formularios afectados

| Formulario | Endpoint esperado | Página |
|---|---|---|
| Consulta de alquiler | `POST /api/v1/alquileres/consulta` | `/alquileres` |
| Solicitud de incorporación obra social | `POST /api/v1/obras-sociales/solicitud` | `/obras-sociales/requisitos` |

---

## Objeto `consentimientos` en el payload

El frontend envía el siguiente objeto como parte del body de cada request POST:

```json
{
  "consentimientos": {
    "terminosYCondiciones": true,
    "politicaDePrivacidad": true,
    "marketing": false,
    "versionTerminos": "1.0",
    "versionPolitica": "1.0"
  }
}
```

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `terminosYCondiciones` | `boolean` | Sí | Aceptación de T&C. Debe ser `true`. |
| `politicaDePrivacidad` | `boolean` | Sí | Aceptación de Política de Privacidad. Debe ser `true`. |
| `marketing` | `boolean` | No | Consentimiento para comunicaciones. Puede ser `false`. |
| `versionTerminos` | `string` | Sí | Versión del documento aceptado (ej: `"1.0"`). |
| `versionPolitica` | `string` | Sí | Versión del documento aceptado (ej: `"1.0"`). |

---

## Payload completo de cada endpoint

### POST /api/v1/alquileres/consulta

```json
{
  "nombre": "Ana García",
  "email": "ana@email.com",
  "telefono": "011-1234-5678",
  "mensaje": "Quisiera consultar sobre disponibilidad del consultorio B.",
  "espacioId": 3,
  "consentimientos": {
    "terminosYCondiciones": true,
    "politicaDePrivacidad": true,
    "marketing": false,
    "versionTerminos": "1.0",
    "versionPolitica": "1.0"
  }
}
```

**Respuesta esperada (éxito):**
```json
{
  "success": true,
  "mensaje": "Consulta recibida. Nos comunicaremos a la brevedad."
}
```

**Respuesta esperada (consentimientos faltantes):**
```json
{
  "success": false,
  "mensaje": "Debes aceptar los Términos y Condiciones y la Política de Privacidad."
}
```
HTTP Status: `422 Unprocessable Entity`

---

### POST /api/v1/obras-sociales/solicitud

```json
{
  "nombre": "Carlos López",
  "email": "carlos@email.com",
  "especialidad": "Fonoaudiología",
  "mensaje": "Deseo consultar sobre el proceso de incorporación al convenio.",
  "consentimientos": {
    "terminosYCondiciones": true,
    "politicaDePrivacidad": true,
    "marketing": true,
    "versionTerminos": "1.0",
    "versionPolitica": "1.0"
  }
}
```

**Respuesta esperada (éxito):**
```json
{
  "success": true,
  "mensaje": "Solicitud recibida. Nos comunicaremos a la brevedad."
}
```

---

## Validaciones que debe hacer el backend

El backend debe rechazar el request si:

1. `consentimientos.terminosYCondiciones !== true`
2. `consentimientos.politicaDePrivacidad !== true`
3. `consentimientos.versionTerminos` está ausente o vacío
4. `consentimientos.versionPolitica` está ausente o vacío
5. Cualquier campo obligatorio del formulario está ausente

> **El frontend también valida estos campos**, pero la validación del backend es la
> fuente de verdad. Un request que llegue al backend sin los consentimientos obligatorios
> debe ser rechazado aunque el frontend lo envíe (defense in depth).

---

## Datos que el backend debe generar (NO enviados por el frontend)

| Dato | Fuente | Motivo |
|---|---|---|
| `timestamp` | Reloj del servidor | El reloj del browser no es confiable como registro legal. |
| `ip_address` | Header HTTP de la conexión (`REMOTE_ADDR` o `X-Forwarded-For`) | La IP no puede ser capturada de forma confiable en el browser. No enviarla desde el frontend. |

> **Decisión de diseño:** El frontend nunca envía timestamp ni IP. El backend los registra
> directamente desde la conexión HTTP. Esto garantiza que el registro de consentimiento
> no puede ser manipulado por el cliente.

---

## Estructura de base de datos recomendada

### Tabla `consentimientos`

```sql
CREATE TABLE consentimientos (
  id                      SERIAL PRIMARY KEY,
  -- Referencia al registro que originó el consentimiento
  origen_tipo             VARCHAR(50) NOT NULL,  -- 'consulta_alquiler' | 'solicitud_obra_social'
  origen_id               INTEGER,               -- ID del registro en la tabla de origen (puede ser NULL si el registro falla)
  -- Datos de la persona (redundantes para auditoría, en caso de que el registro principal se borre)
  nombre                  VARCHAR(255) NOT NULL,
  email                   VARCHAR(255) NOT NULL,
  -- Consentimientos
  terminos_y_condiciones  BOOLEAN NOT NULL DEFAULT FALSE,
  politica_de_privacidad  BOOLEAN NOT NULL DEFAULT FALSE,
  marketing               BOOLEAN NOT NULL DEFAULT FALSE,
  -- Versiones de documentos aceptados
  version_terminos        VARCHAR(20) NOT NULL,
  version_politica        VARCHAR(20) NOT NULL,
  -- Auditoría (generados por el servidor)
  ip_address              INET,                  -- Dirección IP de la conexión HTTP
  user_agent              TEXT,                  -- User-Agent del browser (informativo)
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para consultas por email
CREATE INDEX idx_consentimientos_email ON consentimientos(email);
-- Índice para consultas por origen
CREATE INDEX idx_consentimientos_origen ON consentimientos(origen_tipo, origen_id);
```

### Alternativa: columnas en la tabla existente

Si se prefiere no crear una tabla separada, se pueden agregar columnas directamente
en las tablas `consultas_alquiler` y `solicitudes_obra_social`:

```sql
-- En consultas_alquiler (ejemplo):
ALTER TABLE consultas_alquiler ADD COLUMN terminos_aceptados     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE consultas_alquiler ADD COLUMN politica_aceptada      BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE consultas_alquiler ADD COLUMN marketing_aceptado     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE consultas_alquiler ADD COLUMN version_terminos       VARCHAR(20);
ALTER TABLE consultas_alquiler ADD COLUMN version_politica       VARCHAR(20);
ALTER TABLE consultas_alquiler ADD COLUMN ip_consentimiento      INET;
ALTER TABLE consultas_alquiler ADD COLUMN ua_consentimiento      TEXT;
ALTER TABLE consultas_alquiler ADD COLUMN fecha_consentimiento   TIMESTAMPTZ;
```

> **Recomendación:** La tabla separada `consentimientos` es preferible porque permite:
> - Consultar el historial de consentimientos de un email independientemente del tipo de formulario
> - Agregar futuros formularios sin modificar el esquema de tablas existentes
> - Mantener los registros de auditoría aunque se borren los registros originales

---

## Lógica de registro en el backend (pseudocódigo)

```php
// En el controller que maneja POST /alquileres/consulta:

function handleConsultaAlquiler(Request $request): Response
{
    $data = $request->getBody();

    // 1. Validar campos obligatorios del formulario
    $this->validateRequired($data, ['nombre', 'email', 'mensaje']);

    // 2. Validar consentimientos obligatorios
    if (empty($data['consentimientos']['terminosYCondiciones']) ||
        $data['consentimientos']['terminosYCondiciones'] !== true) {
        return $this->error(422, 'Debes aceptar los Términos y Condiciones.');
    }
    if (empty($data['consentimientos']['politicaDePrivacidad']) ||
        $data['consentimientos']['politicaDePrivacidad'] !== true) {
        return $this->error(422, 'Debes aceptar la Política de Privacidad.');
    }

    // 3. Guardar la consulta principal
    $consultaId = $this->db->insert('consultas_alquiler', [
        'nombre'  => $data['nombre'],
        'email'   => $data['email'],
        'telefono'=> $data['telefono'] ?? null,
        'mensaje' => $data['mensaje'],
        'espacio_id' => $data['espacioId'] ?? null,
    ]);

    // 4. Registrar el consentimiento
    //    El timestamp y la IP los genera el servidor — nunca el frontend.
    $this->db->insert('consentimientos', [
        'origen_tipo'             => 'consulta_alquiler',
        'origen_id'               => $consultaId,
        'nombre'                  => $data['nombre'],
        'email'                   => $data['email'],
        'terminos_y_condiciones'  => true,
        'politica_de_privacidad'  => true,
        'marketing'               => $data['consentimientos']['marketing'] ?? false,
        'version_terminos'        => $data['consentimientos']['versionTerminos'],
        'version_politica'        => $data['consentimientos']['versionPolitica'],
        'ip_address'              => $request->getClientIp(),  // REMOTE_ADDR o X-Forwarded-For
        'user_agent'              => $request->getHeader('User-Agent'),
        'created_at'              => new \DateTime(),  // Timestamp del servidor
    ]);

    return $this->success('Consulta recibida. Nos comunicaremos a la brevedad.');
}
```

---

## Captura de IP

El backend debe obtener la IP del usuario de la siguiente manera (en orden de prioridad):

```php
// PHP sin framework:
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;

// Si hay múltiples IPs en X-Forwarded-For (proxies), tomar la primera:
if ($ip && str_contains($ip, ',')) {
    $ip = trim(explode(',', $ip)[0]);
}
```

> **Importante:** Solo registrar `X-Forwarded-For` si el servidor está detrás de un
> proxy o load balancer de confianza. En caso contrario, usar exclusivamente `REMOTE_ADDR`
> para evitar spoofing.

---

## Versionado de documentos

Los documentos tienen versión definida en el frontend:

| Documento | Archivo | Versión actual |
|---|---|---|
| Términos y Condiciones | `src/legal/terminos.ts` | `1.0` |
| Política de Privacidad | `src/legal/privacidad.ts` | `1.0` |

Cuando los documentos cambien sustancialmente:

1. Incrementar el campo `version` en el archivo `.ts` correspondiente.
2. El frontend empezará a enviar la nueva versión en todos los formularios.
3. El backend almacenará la nueva versión en `version_terminos` / `version_politica`.
4. Esto permite distinguir "el usuario aceptó v1.0 en febrero" de "el usuario aceptó v2.0 en julio".

---

## Decisiones documentadas

| Decisión | Resolución |
|---|---|
| ¿Quién genera el timestamp? | El backend, usando el reloj del servidor. El frontend no envía timestamp. |
| ¿Quién captura la IP? | El backend, desde el header HTTP de la conexión. El frontend no envía ni captura la IP. |
| ¿Dónde se almacenan los consentimientos? | Tabla `consentimientos` separada (recomendado) o columnas en cada tabla de formulario. |
| ¿Se validan en el backend? | Sí. El backend rechaza requests sin consentimientos obligatorios (defense in depth). |
| ¿Qué versión del documento se almacena? | La versión que el frontend envía en el campo `versionTerminos` / `versionPolitica`. |
| ¿Se almacena el User-Agent? | Sí, como dato informativo de auditoría (no identificatorio). |

---

## Archivos del frontend relacionados

| Archivo | Descripción |
|---|---|
| `src/legal/terminos.ts` | Contenido y versión de T&C |
| `src/legal/privacidad.ts` | Contenido y versión de Política de Privacidad |
| `src/types/index.ts` | `ConsentimientosPayload`, `ConsultaAlquilerPayload`, `SolicitudObraSocialPayload` |
| `src/hooks/useConsentimientos.ts` | Hook de estado, validación y construcción del payload |
| `src/components/legal/LegalModal.tsx` | Modal reutilizable de documentos |
| `src/components/legal/TermsAcceptance.tsx` | Checkbox de T&C + Privacidad |
| `src/components/legal/MarketingConsent.tsx` | Checkbox de marketing |
| `src/pages/Alquileres/index.tsx` | Formulario de consulta de alquiler |
| `src/pages/ObrasSociales/Requisitos.tsx` | Formulario de solicitud de obra social |
| `src/pages/Legal/TerminosYCondiciones.tsx` | Página `/terminos-y-condiciones` |
| `src/pages/Legal/PoliticaDePrivacidad.tsx` | Página `/politica-de-privacidad` |
