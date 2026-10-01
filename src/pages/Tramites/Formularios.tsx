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

const formularios: RecursoPdf[] = [
  { ...sinArchivo, id: 1, titulo: 'Solicitud de inscripción de matrícula', descripcion: 'Formulario para iniciar la inscripción de la matrícula profesional.', archivo_nombre: 'solicitud-inscripcion-matricula.pdf', archivo_ruta: '/pdfs/formularios/solicitud-inscripcion-matricula.pdf' },
  { ...sinArchivo, id: 2, titulo: 'Actualización de datos personales', descripcion: 'Formulario para informar cambios en los datos registrados.', archivo_nombre: 'actualizacion-datos-personales.pdf', archivo_ruta: '/pdfs/formularios/actualizacion-datos-personales.pdf' },
  { ...sinArchivo, id: 3, titulo: 'Solicitud de certificado de habilitación', descripcion: 'Formulario para solicitar un certificado de habilitación profesional.', archivo_nombre: 'solicitud-certificado-habilitacion.pdf', archivo_ruta: '/pdfs/formularios/solicitud-certificado-habilitacion.pdf' },
  { ...sinArchivo, id: 4, titulo: 'Declaración jurada de matrícula', descripcion: 'Formulario de declaración jurada para trámites de matrícula.', archivo_nombre: 'declaracion-jurada-matricula.pdf', archivo_ruta: '/pdfs/formularios/declaracion-jurada-matricula.pdf' },
];

export default function FormulariosPage() {
  return (
    <Layout>
      <Helmet><title>Formularios — {SITE_NAME}</title><meta name="description" content="Formularios institucionales disponibles para descargar en PDF." /></Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Formularios</h1><p className="mt-2 text-gray-500 dark:text-gray-400">Descargá los formularios institucionales en PDF</p></Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formularios.map((resource) => <PdfCard key={resource.id} resource={resource} />)}
        </div>
      </div>
    </Layout>
  );
}