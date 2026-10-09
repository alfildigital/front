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
import { BadgeCheck, RefreshCw, FileCheck, Stamp, HelpCircle, ExternalLink, Building2} from 'lucide-react';

// ORIGEN: Archivo interno de configuración centralizada ('src/config/constants.ts')
// CÓMO FUNCIONA: Exporta constantes globales de la aplicación (ej: "Gobierno Ciudad").
// POR QUÉ SE HACE: Evita escribir cadenas de texto a mano ("hardcodear") y permite cambiar el nombre de la institución en un solo lugar.
import { SITE_NAME } from '@/config/constants';

// ORIGEN: Componente contenedor global ('src/components/layout/Layout.tsx')
// CÓMO FUNCIONA: Envuelve el contenido de la página renderizando el Navbar, Sidebar, Footer y el contenedor principal.
// POR QUÉ SE HACE: Mantiene la estructura visual y consistencia de diseño uniforme en todas las páginas de la aplicación.
import { Layout } from '@/components/layout/Layout';

// Estado vacío para cuando no hay trámites cargados en esta página.
import { EmptyState } from '@/components/common/EmptyState';

// ORIGEN: Control visual de paginación ('src/components/common/Pagination.tsx')
// CÓMO FUNCIONA: Dibuja los botones [1][2]..., "Anterior", "Siguiente" y el selector de tamaño de página.
// POR QUÉ SE HACE: Permite al usuario interactuar y cambiar de página o cantidad de ítems visibles.
import { Pagination } from '@/components/common/Pagination';

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
import { Reveal } from '@/components/common/Reveal';


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
  Stamp,
  Building2
};

/**
 * FUNCIÓN RESOLUTORA DE ICONOS
 * CÓMO FUNCIONA: Recibe el nombre del icono en string enviado por la API. Si existe en `ICON_MAP`, lo devuelve; si es null o no existe, retorna `HelpCircle`.
 * POR QUÉ SE HACE: Mecanismo de defensa (Fallback Pattern) para prevenir errores de ejecución si la API responde con un icono que no tenemos importado.
 */
function getIcon(name: string | null): React.ElementType {
  return (name && ICON_MAP[name]) ? ICON_MAP[name] : HelpCircle;
}

const tramites: Tramite[] = [
  {
    id: 1,
    titulo: 'Inscripción de Matrícula',
    descripcion: 'Procedimiento para la inscripción inicial de la matrícula profesional.',
    requisitos: [
      'Solicitud por escrito',
      'DNI (original y copia certificada)',
      'Título habilitante legalizado por escribanía',
      '2 Fotos tipo carnet (4x4)',
      'Constancia de domicilio',
      'Declaración jurada de domicilio',
      'Declaración jurada de ética profesional',
      'Certificado de antecedentes penales',
      'Pago de arancel de inscripción',
    ],
    enlace: '/tramites/formularios',
    icono: 'BadgeCheck',
  },
  {
    id: 2,
    titulo: 'Renovación de Matrícula',
    descripcion: 'Renovación anual de la habilitación profesional.',
    requisitos: [
      'Cuota anual al día',
      'Formulario de renovación completo',
      'Actualización de datos de contacto',
    ],
    enlace: '/tramites/formularios',
    icono: 'RefreshCw',
  },
  {
    id: 3,
    titulo: 'Certificado de Antecedentes Disciplinarios',
    descripcion: 'Solicitud de certificado para presentación ante organismos públicos o privados.',
    requisitos: [
      'Matrícula vigente',
      'Cuota al día',
      'Se solicita por pedido del interesado',
      'Indicar lugar donde será presentado.',
      'Lleva fecha de expedición',
      'Requiere firma de una autoridad del Consejo Directivo y del presidente del Tribunal de Ética.',
    ],
    enlace: null,
    icono: 'FileCheck',
  },
  {
    id: 4,
    titulo: 'Certificado de Libre de Deuda',
    descripcion: 'Acredita que el matriculado no registra deuda de cuota social al momento de expedirse.',
    requisitos: [
      'Se realiza por pedido del interesado.',
      'Indicar lugar donde será presentado.',
      'Lleva fecha de expedición.',
      'Requiere firma de una autoridad del Consejo Directivo y Tersorería del Colegio.',
      'Matrícula vigente.',
      'Pago de arancel correspondiente.',
    ],
    enlace: null,
    icono: 'Stamp',
  },
  {
    id: 5,
    titulo: 'Habilitación Consultorio (2026)',
    descripcion: 'Acredita que el matriculado no registra deuda de cuota social al momento de expedirse.',
    requisitos: [
      'Se realiza por pedido del interesado.',
      'Plano gráfico del consultorio.',
      'Accesibilidad siguiendo criterios de accesibilidad exigidos por el municipio correspondiente',
      'Matrícula vigente.',
      'Pago de arancel correspondiente.',
    ],
    enlace: '/tramites/formularios',
    icono: 'Building2',
  },
];


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
    <article className="flex-col rounded-xl border border-secondary-300 bg-primary-100/20 p-6 shadow-md hover:shadow-primary-500/20 dark:border-primary-700 dark:bg-gray-800/50 dark:hover:shadow-secondary-500/20" >
      {/* Contenedor e icono instanciado como componente de React */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
        <Icon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
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
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(tramites, page, pageSize);

  return (
    <Layout>
      {/* INYECCIÓN SEO: Cambia dinámicamente la etiqueta <title> en el navegador */}
      <Helmet>
        <title>Trámites — {SITE_NAME}</title>
        <meta name="description" content="Información sobre los trámites disponibles en la institución." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Trámites</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Requisitos y procedimientos para gestiones institucionales
          </p>
        </Reveal>

        {tramites.length === 0 && (
          <EmptyState title="Sin trámites" description="No hay trámites disponibles por el momento." />
        )}

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