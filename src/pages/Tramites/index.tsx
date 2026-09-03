// ===========================================================================
// IMPORTACIONES Y DEPENDENCIAS
// ===========================================================================

// ORIGEN: Librería externa 'react-helmet-async'
// CÓMO FUNCIONA: Inyecta y modifica etiquetas directamente en el <head> del documento HTML (DOM).
// POR QUÉ SE HACE: Para gestionar el SEO dinámico (título de la pestaña, meta-descripciones) en una SPA (Single Page Application) sin recargar la página.
import { Helmet } from 'react-helmet-async';

// ORIGEN: Librería externa de iconos 'lucide-react'
// CÓMO FUNCIONA: Importa componentes SVG optimizados individualmente.
// POR QUÉ SE HACE: BadgeCheck, RefreshCw, FileCheck y Stamp son iconos específicos asociados a los tipos de trámites. HelpCircle sirve como ícono por defecto y ExternalLink para indicar enlaces externos.
import { BadgeCheck, RefreshCw, FileCheck, Stamp, HelpCircle, ExternalLink } from 'lucide-react';

// ORIGEN: Archivo interno de configuración centralizada ('src/config/constants.ts')
// CÓMO FUNCIONA: Exporta constantes globales de la aplicación (ej: "Gobierno Ciudad").
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
// POR QUÉ SE HACE: Mejora la percepción de velocidad (UX) durante la carga de datos en lugar de usar un spinner convulsionado.
import { CardSkeletonGrid } from '@/components/common/Skeleton';

// ORIGEN: Control visual de paginación ('src/components/common/Pagination.tsx')
// CÓMO FUNCIONA: Dibuja los botones [1][2]..., "Anterior", "Siguiente" y el selector de tamaño de página.
// POR QUÉ SE HACE: Permite al usuario interactuar y cambiar de página o cantidad de ítems visibles.
import { Pagination } from '@/components/common/Pagination';

// ORIGEN: Custom Hook con React Query ('src/hooks/queries/useTramites.ts')
// CÓMO FUNCIONA: Ejecuta internamente una petición HTTP GET mediante Axios/Fetch hacia la API ('/api/tramites') y gestiona la caché, reintentos y estados (`isPending`, `isError`).
// POR QUÉ SE HACE: Desacopla la lógica de red del componente visual. Si los datos ya están en caché, los entrega al instante.
import { useTramites } from '@/hooks/queries/useTramites';

// ORIGEN: Custom Hook de estado local ('src/hooks/usePagination.ts')
// CÓMO FUNCIONA: Mantiene en el estado interno de React las variables `page` (página activa) y `pageSize` (ítems por página), entregando funciones setters.
// POR QUÉ SE HACE: Reutiliza la lógica de control del estado de paginación en múltiples tablas o listados del sistema.
import { usePagination } from '@/hooks/usePagination';

// ORIGEN: Función utilitaria pura ('src/utils/paginationUtils.ts')
// CÓMO FUNCIONA: Recibe un arreglo completo `data[]`, la página actual y el tamaño. Aplica `data.slice(...)` para recortar los elementos visibles y calcula metadatos (`totalPages`, `from`, `to`).
// POR QUÉ SE HACE: Como la API actual devuelve todos los trámites juntos, esta función realiza la división de páginas en el cliente (Client-side pagination).
import { paginateItems } from '@/utils/paginationUtils';

// ORIGEN: Definición de tipos TypeScript ('src/types/index.ts')
// CÓMO FUNCIONA: Define la interfaz `Tramite` (id, titulo, descripcion, requisitos, icono, enlace).
// POR QUÉ SE HACE: Garantiza autocompletado y validación estricta de tipos en tiempo de compilación.
import type { Tramite } from '@/types';


// ===========================================================================
// MAPEO Y RESOLUCIÓN DINÁMICA DE ICONOS
// ===========================================================================

/**
 * DICCIONARIO DE ICONOS
 * CÓMO FUNCIONA: Mapea una clave en formato string (coincidente con lo que devuelve la API) hacia el componente React del icono.
 * POR QUÉ SE HACE: La API devuelve texto puro (ej: "BadgeCheck"). React no puede renderizar un string directo como un tag JSX `<"BadgeCheck" />`. Este objeto actúa como puente seguro.
 */
const ICON_MAP: Record<string, React.ElementType> = { 
  BadgeCheck, 
  RefreshCw, 
  FileCheck, 
  Stamp 
};

/**
 * FUNCIÓN RESOLUTORA DE ICONOS
 * CÓMO FUNCIONA: Recibe el nombre del icono en string enviado por la API. Si existe en `ICON_MAP`, lo devuelve; si es null o no existe, retorna `HelpCircle`.
 * POR QUÉ SE HACE: Mecanismo de defensa (Fallback Pattern) para prevenir errores de ejecución si la API responde con un icono que no tenemos importado.
 */
function getIcon(name: string | null): React.ElementType {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : HelpCircle;
}


// ===========================================================================
// COMPONENTE SECUNDARIO: TARJETA DE TRÁMITE
// ===========================================================================

interface TramiteCardProps {
  tramite: Tramite; // Recibe un objeto único con la estructura de la interfaz `Tramite`
}

/**
 * CÓMO FUNCIONA: Transforma la información de un único trámite en una tarjeta HTML estructurada (`<article>`).
 * POR QUÉ SE HACE: Modulariza el código. En lugar de escribir 50 líneas de JSX dentro del `.map()`, abstrae la representación individual.
 */
function TramiteCard({ tramite }: TramiteCardProps) {
  // OBTENCIÓN: Resuelve el componente de icono según el atributo `tramite.icono` de la API
  const Icon = getIcon(tramite.icono);

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      {/* Contenedor e icono instanciado como componente de React */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
      </div>

      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{tramite.titulo}</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{tramite.descripcion}</p>

      {/* RENDERIZADO CONDICIONAL: Evalúa si la lista de requisitos tiene elementos */}
      {/* POR QUÉ SE HACE: Evita renderizar la sección y el encabezado "Requisitos" si el arreglo está vacío */}
      {tramite.requisitos.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Requisitos
          </h3>
          <ul className="space-y-1.5">
            {tramite.requisitos.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary-400" aria-hidden="true" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RENDERIZADO CONDICIONAL: Solo muestra el botón/enlace si la propiedad `enlace` existe */}
      {/* POR QUÉ SE HACE: No todos los trámites son digitales o redirigen a una URL externa */}
      {tramite.enlace && (
        <a
          href={tramite.enlace}
          target="_blank" // Abre la URL en una nueva pestaña
          rel="noopener noreferrer" // Medida de seguridad esencial para enlaces con target="_blank"
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Más información
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </article>
  );
}


// ===========================================================================
// COMPONENTE PRINCIPAL (PÁGINA VISTA)
// ===========================================================================

export default function TramitesPage() {
  // -------------------------------------------------------------------------
  // PASO 1: OBTENCIÓN DE DATOS ASÍNCRONOS
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Ejecuta `useTramites()` que consulta a React Query / API backend.
  // CÓMO FUNCIONA: Extrae 4 variables clave de la petición HTTP:
  // - `data`: Contiene el arreglo de trámites traídos del servidor.
  // - `isPending`: Booleano `true` mientras la petición está volando por la red.
  // - `isError`: Booleano `true` si la API devolvió status 4xx, 5xx o falló la red.
  // - `refetch`: Función para volver a ejecutar la petición manualmente.
  const { data, isPending, isError, refetch } = useTramites();

  // -------------------------------------------------------------------------
  // PASO 2: ESTADO LOCAL DE PAGINACIÓN
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Hook `usePagination()` ubicado en 'src/hooks/usePagination.ts'.
  // CÓMO FUNCIONA: Inicializa `page` en 1 y `pageSize` en 10.
  // POR QUÉ SE HACE: Guarda las elecciones de navegación del usuario en el estado del componente.
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  // -------------------------------------------------------------------------
  // PASO 3: CÁLCULO DE DATOS PAGINADOS (CORTAR EL ARREGLO)
  // -------------------------------------------------------------------------
  // DESDE DÓNDE: Función `paginateItems()` ubicada en 'src/utils/paginationUtils.ts'.
  // CÓMO FUNCIONA: Recibe los datos completos (`data ?? []`), la página actual y el tamaño.
  // RETORNA:
  // - `paginatedItems`: Sub-arreglo cortado únicamente con los elementos de la página activa.
  // - `totalItems`: Cantidad total de registros (ej: 45).
  // - `totalPages`: Páginas totales calculadas (ej: 5).
  // - `from` y `to`: Rangos calculados para el resumen (ej: "Mostrando 1–10").
  // POR QUÉ SE HACE: Realiza la división en tiempo de renderizado de forma reactiva.
  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(data ?? [], page, pageSize);

  // -------------------------------------------------------------------------
  // PASO 4: RENDERIZADO Y FLUJO DE ESTADOS DE LA INTERFAZ
  // -------------------------------------------------------------------------
  return (
    <Layout>
      {/* INYECCIÓN SEO: Cambia dinámicamente la etiqueta <title> en el navegador */}
      <Helmet>
        <title>Trámites — {SITE_NAME}</title>
        <meta name="description" content="Información sobre los trámites disponibles en la institución." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Trámites</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Requisitos y procedimientos para gestiones institucionales
          </p>
        </header>

        {/* ── ESTADO A: CARGANDO (isPending === true) ── */}
        {/* CÓMO FUNCIONA: Renderiza 4 esqueletos simulados mientras descarga los datos de la red */}
        {isPending && <CardSkeletonGrid count={4} />}

        {/* ── ESTADO B: ERROR DE RED O API (isError === true) ── */}
        {/* CÓMO FUNCIONA: Si falla la conexión, muestra el banner y le pasa la función `refetch` al botón de reintentar */}
        {isError && <ErrorBanner message="No se pudieron cargar los trámites." onRetry={refetch} />}

        {/* ── ESTADO C: DATOS VACÍOS (No hay carga, no hay error, pero la lista devuelta mide 0) ── */}
        {/* CÓMO FUNCIONA: Evalúa `(data?.length ?? 0) === 0` para confirmar que el backend devolvió un arreglo `[]` */}
        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState title="Sin trámites" description="No hay trámites disponibles por el momento." />
        )}

        {/* ── ESTADO D: ÉXITO Y DESPLIEGUE DE DATOS (paginatedItems.length > 0) ── */}
        {/* CÓMO FUNCIONA: Si hay elementos para mostrar en la página actual, renderiza la grilla y la barra de paginación */}
        {paginatedItems.length > 0 && (
          <>
            {/* Grilla responsiva de tarjetas */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((t) => (
                // Mapea cada objeto trámite al componente `TramiteCard` enviándole sus props
                <TramiteCard key={t.id} tramite={t} />
              ))}
            </div>

            {/* Barra inferior de paginación controlada */}
            {/* POR QUÉ SE HACE: Conecta las funciones `setPage` y `setPageSize` con los eventos del componente hijo */}
            <Pagination
              id="tramites"
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              from={from}
              to={to}
              onPageChange={setPage}        // Ejecuta `setPage(newPage)` al hacer clic en los números de página
              onPageSizeChange={setPageSize} // Ejecuta `setPageSize(newSize)` al cambiar el selector
            />
          </>
        )}
      </div>
    </Layout>
  );
}