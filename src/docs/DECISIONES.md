# Decisiones de Diseño y Contratos Provisionales

## Principios de arquitectura vigentes

Estos principios rigen el desarrollo del frontend y deben respetarse en toda extensión futura.

### Contratos provisionales

Cuando un endpoint no tiene contrato JSON definido por el backend:

1. Se crea una interfaz provisional **solo con las propiedades que la UI necesita en ese momento**.
2. La interfaz se identifica con `[PROVISIONAL]` en el comentario de la sección.
3. Está aislada en `src/types/index.ts`.
4. Al recibir el contrato real: actualizar `types/` y `services/`. Las `pages/` y `components/` **no deben requerir cambios**.

### Lógica de filtrado

La lógica de filtrado **no se coloca dentro de una Page**.

- Funciones de filtrado puras → `src/utils/`
- Lógica que depende de estado React → hook específico

La Page solo obtiene datos, controla estados visuales y compone componentes.

### Estados de API

Cada endpoint contempla estrictamente:

| Estado | Qué mostrar |
|--------|-------------|
| `isPending` | Skeleton / Spinner |
| `isError` | `ErrorBanner` con botón de reintento |
| `data: []` | `EmptyState` (salvo excepciones explícitas) |
| `data` con registros | Contenido |

**Excepción Instagram:** si `data: []`, ocultar la sección (sin `EmptyState`). Si hay error, mostrar `ErrorBanner`.

### Prohibiciones absolutas

- `alert()` / `window.alert()` — **prohibido en toda la aplicación**.
- Paginación sin que el contrato actual la requiera.
- Propiedades inventadas en interfaces provisionales más allá de lo que la UI consume.

---


Este documento registra todas las decisiones tomadas por el agente en ausencia de especificaciones completas.  
Debe actualizarse a medida que el backend define los contratos definitivos.

---

## DECISIÓN-001: Contratos JSON provisionales

**Estado:** Pendiente de confirmación con backend PHP  
**Fecha:** 2024-11  
**Afecta a:** todos los módulos excepto `matriculados/pago`

### Contratos definitivos aún no especificados

Los siguientes endpoints no tienen contrato JSON definido en el documento de requisitos.  
Se crearon estructuras provisionales que deben ser validadas y ajustadas con el backend:

| Endpoint | Interfaz provisional | Archivo |
|----------|---------------------|---------|
| `GET /api/obras-sociales` | `ObraSocial` | `src/types/index.ts` |
| `GET /api/alquileres` | `Alquiler` | `src/types/index.ts` |
| `GET /api/boletin-oficial` | `BoletinPublicacion` | `src/types/index.ts` |
| `GET /api/tramites` | `Tramite` | `src/types/index.ts` |
| `GET /api/honorarios` | `Honorario` | `src/types/index.ts` |
| `GET /api/matriculados` | `Matriculado` | `src/types/index.ts` |
| `GET /api/instagram` | `InstagramPost` | `src/types/index.ts` |

### Contrato definitivo confirmado

| Endpoint | Contrato |
|----------|---------|
| `GET /api/matriculados/pago` | `{ success: true, data: { checkoutUrl: string } }` |

---

## DECISIÓN-002: Wrapper de respuesta API

**Supuesto:** todas las respuestas del backend PHP siguen el formato:

```json
{
  "success": true,
  "data": { ... }
}
```

Si el backend usa un formato diferente (por ejemplo, responde directamente el array sin wrapper),  
el único cambio necesario es en cada archivo de `src/api/services/`.

---

## DECISIÓN-003: Filtrado de matriculados en el cliente

**Decisión:** El filtrado de matriculados por nombre y matrícula se realiza en el cliente.  
**Justificación:** El volumen inicial de registros es razonable para filtrado local.  
**Migración:** La función `filterMatriculados` en `src/pages/Matriculados/Listado.tsx` está separada  
de la presentación. Para migrar a filtrado server-side, reemplazar esa función por un parámetro  
de query en `useMatriculados(query)` sin modificar los componentes de presentación.

---

## DECISIÓN-004: Instagram — ocultar si no hay posts

**Decisión:** Si `GET /api/instagram` devuelve un array vacío, la sección de Instagram  
en el Home se oculta completamente. No se muestra `EmptyState`.  
**Justificación:** Comportamiento especificado en los requisitos.

---

## DECISIÓN-005: Icono del trámite como nombre Lucide

**Supuesto:** El campo `icono` de `Tramite` contiene el nombre de un componente de `lucide-react`  
(ej: `"BadgeCheck"`, `"FileCheck"`).  
**Alternativa:** Si el backend envía una URL de imagen, cambiar el componente `TramiteCard`  
para renderizar `<img>` en vez de un ícono de Lucide.

---

## DECISIÓN-006: Nombre del campo `foto` en Matriculado

**Supuesto:** El campo `foto` es una URL absoluta lista para usar en `<img src>`.  
Si el backend envía una ruta relativa, agregar el prefijo de `config.api.url` en el servicio.

---

## DECISIÓN-007: Paginación no implementada

**Decisión:** En esta versión no se implementa paginación para ningún módulo.  
**Justificación:** Los requisitos no especifican paginación y la interfaz `ApiResponse<T[]>`  
devuelve todos los ítems.  
**Migración:** Para agregar paginación, usar `PaginatedResponse<T>` (ya definida en `src/types/api.ts`)  
y agregar parámetros de página al hook y servicio correspondiente.

---

## DECISIÓN-008: Alineación con los contratos reales del backend

**Contexto:** El front consumía campos provisionales que no coinciden con los DTOs que
expone el backend real (`/var/www/html/cpee/app/Controllers/Api/*Controller.php`). La api key
`VITE_APP_API_KEY` se envía como `Authorization: Bearer <key>` en cada request y el backend
responde bajo `/cpee/api/v1`.

**Decisión (back-end como fuente de verdad):** se alinean tipos, servicios, páginas, mocks
y tests con los DTOs reales. No se crean recursos que el backend no tenga.

Mapeos aplicados:

| Módulo | Endpoint real | Cambio en campos |
|--------|---------------|------------------|
| Noticias | `GET /novedades` | `fecha→fecha_publicacion`, `categoria→autor`, `imagen/resumen` se derivan de `contenido` + `archivo_*`; `adjuntos[]` (varios) → archivo único `archivo_nombre/ruta/tipo/tamano` |
| Matriculados | `GET /profesionales` | `matricula→nro_matricula`, `nombre→nombre + apellido` separados, se quita `especialidad` |
| Boletín | `GET /boletines-oficiales` | `descripcion→resumen`, `fecha→created_at`, `adjuntos[]` → archivo único `archivo_*` |
| Obras Sociales | `GET /obras-sociales` | `logo` eliminado (se usa avatar), `email→correo`, `sitioWeb→url_sitio_web` |

**Derivaciones (la UI sigue funcionando pese a que el backend no entrega ciertos campos):**
- Resumen de noticia/boletín → se extrae de `contenido`/`resumen` quitando HTML.
- Imagen destacada → `archivo_ruta` solo si `archivo_tipo` es `image/*`.

**Archivos tocados:** `src/types/index.ts`, `src/api/endpoints.ts`, `src/config/index.ts`,
`src/api/client.ts`, `src/api/services/*`, `src/pages/{Noticias,Matriculados,BoletinOficial,ObrasSociales}/*`,
`src/components/sections/NoticiasPreview.tsx`, `src/utils/matriculadosUtils.ts`,
`src/mocks/data/*`, `src/test/matriculadosUtils.test.ts`.

**Verificación:** `tsc -b` y `eslint` pasan (excepto un error preexistente en
`src/test/formatters.test.ts` por el matcher no estándar `toEndWith`). Los tests de
`filterMatriculados` (6) pasan.

