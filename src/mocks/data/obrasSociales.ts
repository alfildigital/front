// ===========================================================================
// DATOS MOCK DE OBRAS SOCIALES
// ===========================================================================
// ARCHIVO: src/mocks/data/obrasSociales.ts
//
// PROPÓSITO: Provee datos de prueba estáticos que replican exactamente la
//   estructura que devolvería el endpoint real GET /api/v1/obras-sociales.
//
// CUÁNDO SE USA: Exclusivamente cuando config.mocks.enabled === true,
//   controlado por la variable de entorno VITE_USE_MOCKS=true en el .env.
//
// ALINEACIÓN (4.4): los campos replican el DTO del backend
//   app/Controllers/Api/ObrasSocialesController::map():
//     id, nombre, descripcion, telefono, correo, url_sitio_web.
//   - "correo"         → antes "email"
//   - "url_sitio_web"  → antes "sitioWeb"
//   - "logo" eliminado → el backend no lo expone; la UI usa avatar.
// ===========================================================================

import type { ObraSocial } from '@/types';

export const mockObrasSociales: ObraSocial[] = [
  {
    id: 1,
    nombre: 'OSDE',
    descripcion:
      'Obra social con amplia cobertura nacional y una de las redes de prestadores más extensas del país.',
    telefono: '0800-555-6733',
    correo: 'atencion@osde.com.ar',
    url_sitio_web: 'https://www.osde.com.ar',
  },
  {
    id: 2,
    nombre: 'Swiss Medical',
    descripcion:
      'Medicina prepaga con cobertura integral y asistencia médica de alta complejidad.',
    telefono: '011-5239-3300',
    correo: null,
    url_sitio_web: 'https://www.swissmedical.com.ar',
  },
  {
    id: 3,
    nombre: 'IOMA',
    descripcion:
      'Instituto de Obra Médico Asistencial de la Provincia de Buenos Aires. Cobertura para agentes del estado bonaerense.',
    telefono: '0800-999-4662',
    correo: 'consultas@ioma.gba.gov.ar',
    url_sitio_web: 'https://www.ioma.gba.gov.ar',
  },
  {
    id: 4,
    nombre: 'Medicus',
    descripcion:
      'Medicina prepaga con más de 50 años de trayectoria, enfocada en prevención y calidad de atención.',
    telefono: '011-5238-0000',
    correo: null,
    url_sitio_web: 'https://www.medicus.com.ar',
  },
  {
    id: 5,
    nombre: 'Galeno',
    descripcion:
      'Cobertura médica integral con presencia en todo el país y planes adaptados a cada necesidad.',
    telefono: '0800-888-4253',
    correo: 'atencionalafiliado@galeno.com.ar',
    url_sitio_web: 'https://www.galeno.com.ar',
  },
  {
    id: 6,
    nombre: 'Accord Salud',
    descripcion:
      'Prepaga con cobertura en servicios de salud mental, kinesiología y especialidades ambulatorias.',
    telefono: null,
    correo: 'info@accord.com.ar',
    url_sitio_web: 'https://www.accord.com.ar',
  },
  {
    id: 7,
    nombre: 'PAMI',
    descripcion:
      'Programa de Atención Médica Integral. Cobertura para jubilados y pensionados de la Argentina.',
    telefono: '0800-222-7264',
    correo: null,
    url_sitio_web: 'https://www.pami.org.ar',
  },
  {
    id: 8,
    nombre: 'Federada Salud',
    descripcion:
      'Cobertura médica con amplia red de prestadores en el interior del país.',
    telefono: '0810-777-3252',
    correo: 'consultas@federadasalud.com.ar',
    url_sitio_web: 'https://www.federadasalud.com.ar',
  },
  {
    id: 9,
    nombre: 'OSPEDYC',
    descripcion:
      'Obra Social del Personal de Entidades Deportivas y Civiles. Atención para empleados del sector.',
    telefono: '011-4322-9200',
    correo: null,
    url_sitio_web: 'https://www.ospedyc.org.ar',
  },
  {
    id: 10,
    nombre: 'OSECAC',
    descripcion:
      'Obra Social de Empleados de Comercio y Actividades Civiles. Cobertura para trabajadores del comercio.',
    telefono: '0800-333-0500',
    correo: 'afiliados@osecac.org.ar',
    url_sitio_web: 'https://www.osecac.org.ar',
  },
  {
    id: 11,
    nombre: 'Obra Social en Convenio',
    descripcion:
      'Información de contacto en proceso de actualización. Consultá en la sede del colegio.',
    telefono: null,
    correo: null,
    url_sitio_web: null,
  },
  {
    id: 12,
    nombre: 'Mutual Educadores',
    descripcion: null,
    telefono: null,
    correo: null,
    url_sitio_web: null,
  },
];
