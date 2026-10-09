import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { PdfCard } from '@/components/common/PdfCard';
import { Reveal } from '@/components/common/Reveal';
import type { RecursoPdf } from '@/types';

const sinArchivo: Omit<RecursoPdf, 'id' | 'titulo' | 'descripcion'> = {
  archivo_nombre: null,
  archivo_ruta: null,
  archivo_tipo: 'application/pdf',
  archivo_tamano: null,
  archivo_contenido: null,
  fecha: null,
};

const documentos: RecursoPdf[] = [
  { ...sinArchivo, id: 1, titulo: 'Reglamento de matrícula profesional', descripcion: 'Normativa vigente aplicable a profesionales matriculados.', archivo_nombre: 'reglamento-matricula-profesional.pdf', archivo_ruta: '/pdfs/documentos/reglamento-matricula-profesional.pdf' },
  { ...sinArchivo, id: 2, titulo: 'Código de ética profesional', descripcion: 'Documento de referencia para el ejercicio profesional.', archivo_nombre: 'codigo-etica-profesional.pdf', archivo_ruta: '/pdfs/documentos/codigo-etica-profesional.pdf' },
  { ...sinArchivo, id: 3, titulo: 'Requisitos para trámites profesionales', descripcion: 'Detalle de la documentación necesaria para realizar trámites.', archivo_nombre: 'requisitos-tramites-profesionales.pdf', archivo_ruta: '/pdfs/documentos/requisitos-tramites-profesionales.pdf' },
  { ...sinArchivo, id: 4, titulo: 'Aranceles institucionales vigentes', descripcion: 'Tabla de aranceles aplicables a los trámites institucionales.', archivo_nombre: 'aranceles-institucionales-vigentes.pdf', archivo_ruta: '/pdfs/documentos/aranceles-institucionales-vigentes.pdf' },
];

export default function DocumentosPage() {
  return (
    <Layout>
      <Helmet><title>Documentos — {SITE_NAME}</title><meta name="description" content="Documentos institucionales disponibles para consultar y descargar en PDF." /></Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Documentos</h1><p className="mt-2 text-gray-500 dark:text-gray-400">Normativas y documentos institucionales en PDF</p></Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map((resource) => <PdfCard key={resource.id} resource={resource} />)}
        </div>
      </div>
    </Layout>
  );
}