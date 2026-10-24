import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { PdfCard } from '@/components/common/PdfCard';
import { Reveal } from '@/components/common/Reveal';
import type { RecursoPdf } from '@/types';

const archivos: Omit<RecursoPdf, 'id' | 'titulo' | 'descripcion'> = {
  archivo_nombre: null,
  archivo_ruta: null,
  archivo_tipo: 'application/pdf',
  archivo_tamano: null,
  archivo_contenido: null,
  fecha: null,
};

const documentos: RecursoPdf[] = [
  { ...archivos,
     
    id: 1, 
    titulo: 'Código de ética profesional',
    descripcion: 'Documento de referencia para el ejercicio profesional.', 
    archivo_nombre: 'CODIGO_ETICA.pdf',
    archivo_ruta: '/pdfs/documentos/CODIGO_ETICA.pdf' 

  },

  { ...archivos, 
    
    id: 2, 
    titulo: 'Estatuto institucional', 
    descripcion: 'Aprobado por Asamblea General Ordinaria de fecha 9 de Septiembre 2024.', 
    archivo_nombre: 'estatuto-institucional.pdf', 
    archivo_ruta: '/pdfs/documentos/estatuto-institucional.pdf' 
  
  },
  /*
  { ...archivos, 
    
    id: 3, 
    titulo: 'Requisitos para trámites profesionales', 
    descripcion: 'Detalle de la documentación necesaria para realizar trámites.', 
    archivo_nombre: 'requisitos-tramites-profesionales.pdf', 
    archivo_ruta: '/pdfs/documentos/requisitos-tramites-profesionales.pdf' 

  },
  */
  { ...archivos, id: 4, titulo: 'Aranceles institucionales vigentes', descripcion: 'Tabla de aranceles aplicables a los trámites institucionales.', archivo_nombre: 'aranceles-institucionales-vigentes.pdf', archivo_ruta: '/pdfs/documentos/aranceles-institucionales-vigentes.pdf' },
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