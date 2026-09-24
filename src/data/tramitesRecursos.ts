import type { RecursoPdf } from '@/types';

const sinArchivo = {
  archivo_nombre: null,
  archivo_ruta: null,
  archivo_tipo: 'application/pdf',
  archivo_tamano: null,
  archivo_contenido: null,
  fecha: null,
};

export const formularios: RecursoPdf[] = [
  { ...sinArchivo, id: 1, titulo: 'Solicitud de inscripción de matrícula', descripcion: 'Formulario para iniciar la inscripción de la matrícula profesional.', archivo_nombre: 'solicitud-inscripcion-matricula.pdf', archivo_ruta: '/pdfs/formularios/solicitud-inscripcion-matricula.pdf' },
  { ...sinArchivo, id: 2, titulo: 'Actualización de datos personales', descripcion: 'Formulario para informar cambios en los datos registrados.', archivo_nombre: 'actualizacion-datos-personales.pdf', archivo_ruta: '/pdfs/formularios/actualizacion-datos-personales.pdf' },
  { ...sinArchivo, id: 3, titulo: 'Solicitud de certificado de habilitación', descripcion: 'Formulario para solicitar un certificado de habilitación profesional.', archivo_nombre: 'solicitud-certificado-habilitacion.pdf', archivo_ruta: '/pdfs/formularios/solicitud-certificado-habilitacion.pdf' },
  { ...sinArchivo, id: 4, titulo: 'Declaración jurada de matrícula', descripcion: 'Formulario de declaración jurada para trámites de matrícula.', archivo_nombre: 'declaracion-jurada-matricula.pdf', archivo_ruta: '/pdfs/formularios/declaracion-jurada-matricula.pdf' },
];

export const documentos: RecursoPdf[] = [
  { ...sinArchivo, id: 1, titulo: 'Reglamento de matrícula profesional', descripcion: 'Normativa vigente aplicable a profesionales matriculados.', archivo_nombre: 'reglamento-matricula-profesional.pdf', archivo_ruta: '/pdfs/documentos/reglamento-matricula-profesional.pdf' },
  { ...sinArchivo, id: 2, titulo: 'Código de ética profesional', descripcion: 'Documento de referencia para el ejercicio profesional.', archivo_nombre: 'codigo-etica-profesional.pdf', archivo_ruta: '/pdfs/documentos/codigo-etica-profesional.pdf' },
  { ...sinArchivo, id: 3, titulo: 'Requisitos para trámites profesionales', descripcion: 'Detalle de la documentación necesaria para realizar trámites.', archivo_nombre: 'requisitos-tramites-profesionales.pdf', archivo_ruta: '/pdfs/documentos/requisitos-tramites-profesionales.pdf' },
  { ...sinArchivo, id: 4, titulo: 'Aranceles institucionales vigentes', descripcion: 'Tabla de aranceles aplicables a los trámites institucionales.', archivo_nombre: 'aranceles-institucionales-vigentes.pdf', archivo_ruta: '/pdfs/documentos/aranceles-institucionales-vigentes.pdf' },
];