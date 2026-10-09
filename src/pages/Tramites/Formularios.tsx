// Importa el componente Helmet de react-helmet-async.
// Se usa para inyectar dinámicamente etiquetas <title> y <meta> en el <head>
// del documento (SEO y título de pestaña) desde un componente React.
// Se prefiere 'react-helmet-async' sobre 'react-helmet' porque es compatible
// con renderizado en servidor (SSR) y evita fugas de memoria en streaming.
import { Helmet } from 'react-helmet-async';

// Importa la constante SITE_NAME desde el archivo de constantes globales.
// Centralizar el nombre del sitio evita repetir strings y facilita cambiarlo.
import { SITE_NAME } from '@/config/constants';

// Importa el componente Layout, que envuelve la página con la estructura
// común (header, footer, navegación, etc.). Así esta página solo se preocupa
// por su contenido específico.
import { Layout } from '@/components/layout/Layout';

// Importa PdfCard, un componente reutilizable que muestra la tarjeta de un
// recurso PDF (título, descripción, botón de descarga, etc.).
// Se reutiliza para cada elemento del listado, evitando duplicar markup.
import { PdfCard } from '@/components/common/PdfCard';

// Importa Reveal, un componente de animación (probablemente basado en
// IntersectionObserver + Framer Motion) que revela su contenido al hacer scroll.
// Se usa para dar una entrada suave al header de la página.
import { Reveal } from '@/components/common/Reveal';

// Importa el tipo RecursoPdf. Es un 'import type', así que se elimina en
// tiempo de compilación y no genera código JS. Tipar los datos garantiza
// que cada formulario tenga la forma esperada.
import type { RecursoPdf } from '@/types';

// ---------------------------------------------------------------
// 'formulario_card' es un OBJETO PLANTILLA (template) que contiene los
// campos comunes a todos los formularios. Su tipo es 'Omit<RecursoPdf, 'id' | 'titulo' | 'descripcion'>',
// es decir: la forma de RecursoPdf pero SIN los campos id, titulo y descripcion,
// porque esos son únicos por cada formulario y se añaden después con spread.
//
// 'const' (no 'let') porque el objeto no se reasigna.
// El nombre usa snake_case probablemente por consistencia con el backend
// o porque es un objeto "de datos" más que una entidad del dominio.
const formulario_card: Omit<RecursoPdf, 'id' | 'titulo' | 'descripcion'> = {
  // Valor por defecto: null. Se sobrescribe en cada formulario concreto.
  archivo_nombre: null,
  // Ídem: null. Aquí se pondrá la ruta pública del PDF.
  archivo_ruta: null,
  // MIME type por defecto. Todos son PDFs, así que se fija aquí para no
  // repetirlo en cada elemento del array.
  archivo_tipo: 'application/pdf',
  // Tamaño del archivo (bytes). null porque no se conoce o no se usa aún.
  archivo_tamano: null,
  // Contenido embebido (por ejemplo, base64). null porque se descarga
  // desde archivo_ruta, no se embebe.
  archivo_contenido: null,
  // Fecha de publicación/actualización. null porque no aplica o no se muestra.
  fecha: null,
};

// ---------------------------------------------------------------
// Array con TODOS los formularios. Tipado como RecursoPdf[] para que
// TypeScript valide que cada objeto cumple la interfaz.
// Se construye cada elemento con SPREAD del template (...formulario_card)
// y luego se sobrescriben los campos únicos: id, titulo, descripcion,
// archivo_nombre y archivo_ruta.
//
// Ventaja del spread: si mañana se añade un campo nuevo a RecursoPdf con
// un valor por defecto, solo hay que tocar 'formulario_card' y no los 4 objetos.
const formularios: RecursoPdf[] = [

  { ...formulario_card, 
    id: 1, 
    titulo: 'Nota solicitud de matrícula profesional',
    descripcion: 'Formulario para iniciar la inscripción de la matrícula profesional.', 
    archivo_nombre: 'solicitud-inscripcion-matricula.pdf', 
    archivo_ruta: '/public/Nota_solicitud_matriculacion_(colegio).pdf' },

  { ...formulario_card,
    id: 2, 
    titulo: 'Habilitación del consultorio', 
    descripcion: 'Requerimiento para la habilitación del consultorio.',
    archivo_nombre: 'Habilitacion_consultorio_(2026).pdf', 
    archivo_ruta: '/public/Habilitacion_consultorio_(2026).pdf' },

  { ...formulario_card, 
    id: 3, 
    titulo: 'Solicitud de certificado de habilitación', 
    descripcion: 'Formulario para solicitar un certificado de habilitación profesional.', 
    archivo_nombre: 'solicitud-certificado-habilitacion.pdf', 
    archivo_ruta: '/pdfs/formularios/solicitud-certificado-habilitacion.pdf' },

  { ...formulario_card, 
    id: 4, 
    titulo: 'Declaración jurada de matrícula', 
    descripcion: 'Formulario de declaración jurada para trámites de matrícula.', 
    archivo_nombre: 'declaracion-jurada-matricula.pdf', 
    archivo_ruta: '/pdfs/formularios/declaracion-jurada-matricula.pdf' },
];

// ---------------------------------------------------------------
// Componente funcional (default export) de la página "Formularios".
// Se exporta por defecto porque el router lo importa como lazy/dinámico
// y no necesita un nombre concreto.
export default function FormulariosPage() {
  return (
    // Layout: provee la estructura visual común (header, footer, sidebar).
    <Layout>
      {/* Helmet: mete en el <head> el título de la pestaña y una meta
          descripción. El título interpola SITE_NAME para que quede
          "Formularios — MiSitio". La meta description ayuda al SEO. */}
      <Helmet>
        <title>Formularios — {SITE_NAME}</title>
        <meta name="description" content="Formularios institucionales disponibles para descargar en PDF." />
      </Helmet>

      {/* Contenedor principal con utilidades Tailwind:
          - mx-auto: centra horizontalmente
          - max-w-7xl: ancho máximo consistente con el resto del sitio
          - px-4 py-12 sm:px-6 lg:px-8: padding responsive (mobile → desktop)
          Este patrón es típico en Tailwind para layouts responsive. */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Reveal actúa como <header> semántico (prop 'as') y aplica
            animación de aparición. El className con mb-8 separa del grid.
            Dentro: h1 con el título visible y un p con subtítulo.
            Los colores usan pares claro/oscuro (dark:) para soportar
            el modo oscuro del sitio. */}
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Formularios</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Descargá los formularios institucionales en PDF</p>
        </Reveal>

        {/* Grid responsive de 1 columna en móvil, 2 en sm, 3 en lg.
            gap-6 da separación uniforme entre tarjetas. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recorre el array y renderiza una PdfCard por cada formulario.
              'key={resource.id}' es obligatorio en listas React para que el
              reconciliador identifique cada ítem. Se usa 'id' (único y estable)
              y no el índice, para evitar bugs si el array se reordena. */}
          {formularios.map((resource) => <PdfCard key={resource.id} resource={resource} />)}
        </div>
      </div>
    </Layout>
  );
}