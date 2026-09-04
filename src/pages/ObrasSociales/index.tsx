// ===========================================================================
// IMPORTACIONES Y DEPENDENCIAS
// ===========================================================================

// ORIGEN: Librería externa 'react-helmet-async'
// CÓMO FUNCIONA: Inyecta y modifica etiquetas directamente en el <head> del documento HTML (DOM).
// POR QUÉ SE HACE: Para gestionar el SEO dinámico (título de la pestaña, meta-descripciones) en una SPA (Single Page Application) sin recargar la página.
import { Helmet } from 'react-helmet-async';

// ORIGEN: Librería externa de iconos 'lucide-react'
// CÓMO FUNCIONA: Importa componentes SVG optimizados individualmente (tree-shaking).
// POR QUÉ SE HACE: Cada icono representa un tipo de contacto en la tarjeta de obra social.
//   - Phone:       Icono de teléfono para mostrar el número de contacto.
//   - Mail:        Icono de correo para mostrar el email de la obra social.
//   - Globe:       Icono de globo terráqueo para el enlace al sitio web.
//   - ExternalLink: Flecha de enlace externo para indicar que el link abre en nueva pestaña.
//   - Building2:   Icono de edificio para el avatar por defecto cuando no hay logo.
import { Phone, Mail, Globe, ExternalLink, Building2 } from 'lucide-react';

// ORIGEN: Archivo interno de configuración centralizada ('src/config/constants.ts')
// CÓMO FUNCIONA: Exporta constantes globales de la aplicación (ej: "Colegio de Profesionales en Educación Especial").
// POR QUÉ SE HACE: Evita escribir cadenas de texto a mano ("hardcodear") y permite cambiar el nombre de la institución en un solo lugar.
import { SITE_NAME } from '@/config/constants';

// ORIGEN: Componente contenedor global ('src/components/layout/Layout.tsx')
// CÓMO FUNCIONA: Envuelve el contenido de la página renderizando el Navbar, Sidebar, Footer y el contenedor principal.
// POR QUÉ SE HACE: Mantiene la estructura visual y consistencia de diseño uniforme en todas las páginas de la aplicación.
import { Layout } from '@/components/layout/Layout';

// ORIGEN: Componente UI reutilizable de errores ('src/components/common/ErrorBanner.tsx')
// CÓMO FUNCIONA: Muestra una alerta visual de error y expone un botón para reintentar la acción.
// POR QUÉ SE HACE: Estandariza la experiencia de usuario cuando ocurre un fallo en las peticiones HTTP a la API.
import { ErrorBanner } from '@/components/common/ErrorBanner';

// ORIGEN: Componente UI para estados vacíos ('src/components/common/EmptyState.tsx')
// CÓMO FUNCIONA: Muestra un mensaje amigable e ilustración cuando un arreglo de datos llega vacío.
// POR QUÉ SE HACE: Evita dejar la pantalla en blanco y le confirma explícitamente al usuario que no existen registros.
import { EmptyState } from '@/components/common/EmptyState';

// ORIGEN: Componente de carga visual ('src/components/common/Skeleton.tsx')
// CÓMO FUNCIONA: Dibuja tarjetas grises animadas que simulan la estructura de las tarjetas reales.
// POR QUÉ SE HACE: Mejora la percepción de velocidad (UX) durante la carga de datos en lugar de usar un spinner.
import { CardSkeletonGrid } from '@/components/common/Skeleton';

// ORIGEN: Control visual de paginación ('src/components/common/Pagination.tsx')
// CÓMO FUNCIONA: Dibuja los botones [1][2]..., "Anterior", "Siguiente" y el selector de tamaño de página.
// POR QUÉ SE HACE: Permite al usuario interactuar y cambiar de página o cantidad de ítems visibles.
import { Pagination } from '@/components/common/Pagination';

// ORIGEN: Custom Hook con React Query ('src/hooks/queries/useObrasSociales.ts')
// CÓMO FUNCIONA: Ejecuta internamente una petición HTTP GET mediante Axios hacia la API
//   ('/api/obras-sociales') y gestiona la caché, reintentos y estados (`isPending`, `isError`).
//   Cuando config.mocks.enabled === true (variable VITE_USE_MOCKS en .env), usa datos del
//   archivo 'src/mocks/data/obrasSociales.ts' en lugar de llamar a la red.
// POR QUÉ SE HACE: Desacopla la lógica de red del componente visual. Si los datos ya están
//   en caché de React Query, los entrega al instante sin volver a hacer la petición HTTP.
import { useObrasSociales } from '@/hooks/queries/useObrasSociales';

// ORIGEN: Custom Hook de estado local ('src/hooks/usePagination.ts')
// CÓMO FUNCIONA: Mantiene en el estado interno de React las variables `page` (página activa)
//   y `pageSize` (ítems por página), entregando funciones setters para actualizarlos.
// POR QUÉ SE HACE: Reutiliza la lógica de control del estado de paginación en múltiples
//   tablas o listados del sistema sin duplicar código.
import { usePagination } from '@/hooks/usePagination';

// ORIGEN: Función utilitaria pura ('src/utils/paginationUtils.ts')
// CÓMO FUNCIONA: Recibe un arreglo completo `data[]`, la página actual y el tamaño.
//   Aplica `data.slice(...)` para recortar los elementos visibles y calcula metadatos
//   (`totalPages`, `from`, `to`).
// POR QUÉ SE HACE: Como la API actual devuelve todas las obras sociales juntas, esta función
//   realiza la división de páginas en el cliente (Client-side pagination). Esto evita múltiples
//   llamadas a la API al cambiar de página.
import { paginateItems } from '@/utils/paginationUtils';

// ORIGEN: Definición de tipos TypeScript ('src/types/index.ts')
// CÓMO FUNCIONA: Define la interfaz `ObraSocial` con la estructura completa del objeto,
//   alineada con el DTO del backend (4.4): { id, nombre, descripcion, telefono, correo, url_sitio_web }.
// POR QUÉ SE HACE: Garantiza autocompletado en el IDE y validación estricta de tipos
//   en tiempo de compilación, evitando errores en tiempo de ejecución.
import type { ObraSocial } from '@/types';


// ===========================================================================
// COMPONENTE SECUNDARIO: TARJETA DE OBRA SOCIAL
// ===========================================================================

/**
 * Props que recibe el componente ObraSocialCard.
 * ORIGEN DEL TIPO: Interfaz `ObraSocial` definida en 'src/types/index.ts'
 *
 * ALINEACIÓN CON BACKEND (4.4): los campos siguen el DTO de
 * GET /api/v1/obras-sociales. El backend no expone "logo", por lo que la
 * tarjeta siempre usa el avatar con ícono Building2.
 *
 * Propiedades del objeto recibido:
 *   - id:            Identificador único (número). Usado como `key` en el `.map()` del padre.
 *   - nombre:        Nombre de la obra social (string). Se muestra como título de la tarjeta.
 *   - descripcion:   Texto descriptivo de la obra social (string | null). Se muestra debajo del nombre.
 *   - telefono:      Número de contacto (string | null). Se renderiza condicionalmente con ícono Phone.
 *   - correo:        Correo electrónico (string | null). Se renderiza condicionalmente con ícono Mail.
 *   - url_sitio_web: URL del sitio web oficial (string | null). Se renderiza condicionalmente como enlace externo.
 */
interface ObraSocialCardProps {
  obraSocial: ObraSocial;
}

/**
 * COMPONENTE: ObraSocialCard
 *
 * CÓMO FUNCIONA: Transforma la información de una única obra social en una tarjeta HTML
 *   estructurada (`<article>`). Muestra nombre, logo o avatar, descripción y datos de contacto.
 *
 * POR QUÉ SE HACE: Modulariza el código. En lugar de escribir todo el JSX dentro del `.map()`
 *   del componente principal, abstrae la representación individual de cada obra social en su
 *   propio componente reutilizable.
 *
 * FLUJO DE RENDERIZADO INTERNO:
 *   1. Recibe el objeto `obraSocial` como prop.
 *   2. Evalúa si `logo` tiene valor para decidir entre imagen real o avatar por defecto.
 *   3. Renderiza descripción solo si existe (renderizado condicional).
 *   4. Renderiza teléfono, email y sitio web solo si existen (renderizado condicional).
 */
function ObraSocialCard({ obraSocial }: ObraSocialCardProps) {
  return (
    // `article` es el elemento semántico correcto de HTML5 para una entidad autocontenida.
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">

      {/* ── ENCABEZADO: Avatar + Nombre de la obra social ──
          ALINEACIÓN (4.4): el backend no devuelve "logo", por lo que siempre
          se muestra el avatar con el ícono Building2 como identificador visual. */}
      <div className="mb-4 flex items-center gap-4">
        {/* Avatar de respaldo (ícono Building2) — sin logo del backend */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Building2 className="h-7 w-7 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>

        {/* Nombre de la obra social como título semántico */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          {obraSocial.nombre}
        </h2>
      </div>

      {/* ── DESCRIPCIÓN (CONDICIONAL) ──
          CÓMO FUNCIONA: El operador `&&` evalúa si `obraSocial.descripcion` es truthy.
          Si la descripcion es null o string vacío, este bloque no se monta en el DOM.
          POR QUÉ SE HACE: La descripción puede no estar cargada aún en el backend. */}
      {obraSocial.descripcion && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {obraSocial.descripcion}
        </p>
      )}

      {/* ── DATOS DE CONTACTO ──
          CÓMO FUNCIONA: Sección que agrupa los tres posibles canales de contacto.
          Cada uno se renderiza condicionalmente según si la propiedad existe en el objeto.
          POR QUÉ SE HACE: Una obra social puede tener algunos canales pero no todos;
          mostrar solo los disponibles evita mostrar información vacía al usuario. */}
      <div className="mt-auto space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-700">

        {/* TELÉFONO (CONDICIONAL):
            Solo se renderiza si `obraSocial.telefono` tiene valor.
            El atributo `href="tel:..."` permite marcar el número directamente en dispositivos móviles. */}
        {obraSocial.telefono && (
          <div className="flex items-center gap-2">
            {/* Ícono de teléfono — aria-hidden para que los lectores de pantalla ignoren el ícono decorativo */}
            <Phone className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <a
              href={`tel:${obraSocial.telefono}`}
              className="text-sm text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              {obraSocial.telefono}
            </a>
          </div>
        )}

        {/* CORREO (CONDICIONAL):
            Solo se renderiza si `obraSocial.correo` tiene valor.
            El `href="mailto:..."` abre el cliente de correo del sistema operativo del usuario.
            (antes "email" — renombrado a "correo" por alineación con el backend, 4.4) */}
        {obraSocial.correo && (
          <div className="flex items-center gap-2">
            {/* Ícono de correo — decorativo, oculto para asistentes de accesibilidad */}
            <Mail className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <a
              href={`mailto:${obraSocial.correo}`}
              className="text-sm text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors truncate"
            >
              {obraSocial.correo}
            </a>
          </div>
        )}

        {/* SITIO WEB (CONDICIONAL):
            Solo se renderiza si `obraSocial.url_sitio_web` tiene valor.
            `target="_blank"` abre en nueva pestaña.
            `rel="noopener noreferrer"` es una medida de seguridad obligatoria para evitar
            que la página destino pueda acceder al objeto `window.opener` de nuestra app.
            (antes "sitioWeb" — renombrado a "url_sitio_web" por alineación con el backend, 4.4) */}
        {obraSocial.url_sitio_web && (
          <div className="flex items-center gap-2">
            {/* Ícono de globo terráqueo para representar el sitio web */}
            <Globe className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <a
              href={obraSocial.url_sitio_web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Visitar sitio web
              {/* ExternalLink indica visualmente al usuario que el enlace abre fuera de la aplicación */}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}


// ===========================================================================
// COMPONENTE PRINCIPAL (PÁGINA VISTA)
// ===========================================================================

/**
 * COMPONENTE: ObrasSocialesPage (export default — ruta: /obras-sociales)
 *
 * RESPONSABILIDAD: Página completa que lista todas las obras sociales adheridas al colegio.
 *
 * ── FLUJO DE COMUNICACIÓN COMPLETO ──────────────────────────────────────────
 *
 * 1. MONTAJE DEL COMPONENTE
 *    React monta ObrasSocialesPage al navegar a la ruta /obras-sociales.
 *    Se ejecutan los hooks en orden:
 *      a) useObrasSociales() → Dispara la petición a GET /api/obras-sociales
 *      b) usePagination()    → Inicializa el estado local de paginación
 *
 * 2. FLUJO DE OBTENCIÓN DE DATOS (useObrasSociales)
 *    src/hooks/queries/useObrasSociales.ts
 *      ↓ decide según config.mocks.enabled (VITE_USE_MOCKS en .env)
 *    [MODO MOCK]  → mockObrasSocialesService.getAll()
 *                   → Lee 'src/mocks/data/obrasSociales.ts' con delay simulado
 *    [MODO REAL]  → obrasSocialesService.getAll()
 *                   → apiClient.get('/obras-sociales')
 *                   → axios envía GET con headers Content-Type: application/json
 *                   → El backend responde con { data: ObraSocial[], ... }
 *                   → El servicio extrae `response.data.data` y lo retorna
 *    React Query guarda el resultado en su caché con key ['obras-sociales'].
 *    En próximas visitas a la ruta, sirve el caché instantáneamente.
 *
 * 3. GESTIÓN DE ESTADOS DE INTERFAZ
 *    La UI renderiza condicionalmente según los 4 estados posibles:
 *      A) isPending === true               → <CardSkeletonGrid count={4} />
 *      B) isError === true                 → <ErrorBanner onRetry={refetch} />
 *      C) data vacío (length === 0)        → <EmptyState />
 *      D) paginatedItems.length > 0        → Grid de tarjetas + Paginación
 *
 * 4. PAGINACIÓN EN CLIENTE
 *    paginateItems(data ?? [], page, pageSize)
 *      → Recorta el array completo con .slice() según la página activa
 *      → Retorna { data: ObraSocial[], totalItems, totalPages, from, to }
 *    Cuando el usuario hace clic en un número de página:
 *      setPage(nuevaPagina) → React re-renderiza → paginateItems recalcula → nueva porción
 *
 * 5. INTERACCIÓN DEL USUARIO CON PAGINACIÓN
 *    <Pagination onPageChange={setPage} onPageSizeChange={setPageSize} />
 *      → Clic en número de página → setPage(n) → re-render automático
 *      → Cambia items por página  → setPageSize(n) → re-render automático
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function ObrasSocialesPage() {
  // -------------------------------------------------------------------------
  // PASO 1: OBTENCIÓN DE DATOS ASÍNCRONOS
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Ejecuta `useObrasSociales()` que consulta a React Query / API backend.
  // CÓMO FUNCIONA: Extrae 4 variables clave del resultado de la petición HTTP:
  //   - `data`:      Array de ObraSocial[] traído del servidor. `undefined` mientras carga.
  //   - `isPending`: Booleano `true` durante la primera carga (sin caché previo).
  //   - `isError`:   Booleano `true` si la API devolvió status 4xx/5xx o falló la red.
  //   - `refetch`:   Función para volver a ejecutar la petición (usada en ErrorBanner).
  const { data, isPending, isError, refetch } = useObrasSociales();

  // -------------------------------------------------------------------------
  // PASO 2: ESTADO LOCAL DE PAGINACIÓN
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Hook `usePagination()` ubicado en 'src/hooks/usePagination.ts'.
  // CÓMO FUNCIONA: Inicializa `page` en 1 y `pageSize` en 10.
  //   Internamente usa `useState` de React para guardar estos valores.
  // POR QUÉ SE HACE: Centraliza la lógica de paginación en un hook reutilizable,
  //   evitando duplicar `useState` en cada página que necesite paginación.
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  // -------------------------------------------------------------------------
  // PASO 3: CÁLCULO DE DATOS PAGINADOS (CORTAR EL ARREGLO EN EL CLIENTE)
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Función `paginateItems()` ubicada en 'src/utils/paginationUtils.ts'.
  // CÓMO FUNCIONA: Recibe el arreglo completo (`data ?? []` previene undefined/null),
  //   la página actual y el tamaño de página.
  // RETORNA un objeto con:
  //   - `paginatedItems` (renombrado desde `data`): Sub-arreglo con solo los elementos de la página activa.
  //   - `totalItems`:    Cantidad total de registros en el arreglo completo (ej: 12).
  //   - `totalPages`:    Páginas totales calculadas (ej: si son 12 items y pageSize=10 → 2 páginas).
  //   - `from` y `to`:   Índices calculados para el resumen textual (ej: "Mostrando 1–10 de 12").
  // POR QUÉ SE HACE: La API devuelve todas las obras sociales en una sola respuesta.
  //   Esta función realiza la división en tiempo de renderizado de forma reactiva.
  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(data ?? [], page, pageSize);

  // -------------------------------------------------------------------------
  // PASO 4: RENDERIZADO Y FLUJO DE ESTADOS DE LA INTERFAZ
  // -------------------------------------------------------------------------
  return (
    <Layout>
      {/* INYECCIÓN SEO: Helmet modifica dinámicamente las etiquetas <title> y <meta>
          en el <head> del HTML sin recargar la página completa (SPA behavior).
          POR QUÉ: Los motores de búsqueda indexan el título y la descripción. */}
      <Helmet>
        <title>Obras Sociales Adheridas — {SITE_NAME}</title>
        <meta
          name="description"
          content="Listado de obras sociales adheridas al colegio con información de contacto y sitio web oficial."
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── ENCABEZADO DE PÁGINA ── */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Obras Sociales Adheridas
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Obras sociales con convenio vigente con el colegio. Consultá su información de contacto y sitio web.
          </p>
        </header>

        {/* ── ESTADO A: CARGANDO (isPending === true) ──
            CÓMO FUNCIONA: Mientras la promesa de useObrasSociales() no resolvió, `isPending` es true.
            Se muestran 4 tarjetas esqueleto animadas que ocupan el mismo espacio visual que las tarjetas reales.
            POR QUÉ SE HACE: Evitar el "salto de layout" (CLS — Cumulative Layout Shift) al cargar los datos. */}
        {isPending && <CardSkeletonGrid count={4} />}

        {/* ── ESTADO B: ERROR DE RED O API (isError === true) ──
            CÓMO FUNCIONA: Si la promesa rechazó (HTTP 4xx/5xx o sin conexión), `isError` se pone en true.
            Se muestra el banner rojo con el mensaje y el botón de reintento.
            `refetch` es la función de React Query que re-ejecuta la petición HTTP manualmente. */}
        {isError && (
          <ErrorBanner
            message="No se pudieron cargar las obras sociales."
            onRetry={refetch}
          />
        )}

        {/* ── ESTADO C: DATOS VACÍOS ──
            CÓMO FUNCIONA: Evalúa la triple condición para asegurar que:
              - !isPending:               La carga ya terminó (no sigue en progreso).
              - !isError:                 No hubo error (la petición fue exitosa).
              - (data?.length ?? 0) === 0: El servidor respondió con un array vacío [].
            POR QUÉ SE HACE: Sin este estado, el usuario vería una pantalla completamente vacía
            sin saber si algo salió mal o si simplemente no hay datos cargados. */}
        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState
            title="Sin obras sociales"
            description="No hay obras sociales disponibles por el momento."
          />
        )}

        {/* ── ESTADO D: ÉXITO — DESPLIEGUE DE DATOS ──
            CÓMO FUNCIONA: Solo se ejecuta cuando `paginatedItems` tiene elementos.
            Esto implica automáticamente que isPending === false, isError === false y data.length > 0.
            Se renderiza el grid de tarjetas y la barra de paginación. */}
        {paginatedItems.length > 0 && (
          <>
            {/* GRILLA RESPONSIVA DE TARJETAS:
                - 1 columna en móvil (<640px)
                - 2 columnas en tablet (≥640px)
                - 3 columnas en escritorio (≥1024px)
                POR QUÉ SE HACE: Diseño adaptativo (responsive) para distintos dispositivos. */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((os) => (
                // CLAVE ÚNICA: Se usa `os.id` (número único del backend) como `key` de React.
                // POR QUÉ SE HACE: React usa `key` para el algoritmo de reconciliación del DOM virtual.
                // Usar el ID del backend es más estable que usar el índice del array.
                <ObraSocialCard key={os.id} obraSocial={os} />
              ))}
            </div>

            {/* BARRA DE PAGINACIÓN:
                CÓMO FUNCIONA: Recibe los datos calculados por `paginateItems` y las funciones setters.
                  - `page` y `pageSize`:    Estado actual leído del hook usePagination.
                  - `totalItems`:           Total de registros para calcular el resumen textual.
                  - `totalPages`:           Para saber cuántos botones de página dibujar.
                  - `from` y `to`:          Para mostrar "Mostrando X–Y de Z".
                  - `onPageChange`:         Ejecuta `setPage(n)` al hacer clic en un número de página.
                  - `onPageSizeChange`:     Ejecuta `setPageSize(n)` al cambiar el selector de ítems.
                POR QUÉ SE HACE: Conecta los eventos del componente hijo con el estado del padre. */}
            <Pagination
              id="obras-sociales"
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              from={from}
              to={to}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </Layout>
  );
}