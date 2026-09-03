/**
 * Constantes de aplicación que no dependen de variables de entorno.
 */
export const SITE_NAME = 'Colegio de Profesionales en Educación Especial';

export const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Trámites', to: '/tramites' },
  {
    label: 'Nosotros / Matriculados',
    children: [
      { label: 'Pagar Matrícula', to: '/matriculados/pago' },
      { label: 'Información Institucional', to: '/matriculados/informacion' },
      { label: 'Honorarios', to: '/matriculados/honorarios' },
      { label: 'Acceso a Profesionales', to: '/matriculados/listado' },
    ],
  },
  {
    label: 'Obras Sociales',
    children: [
      { label: 'Obras Sociales Adheridas', to: '/obras-sociales' },
      { label: 'Aranceles', to: '/obras-sociales/aranceles' },
      { label: 'Requisitos para incorporación', to: '/obras-sociales/requisitos' },
    ],
  },
  { label: 'Alquileres', to: '/alquileres' },
  { label: 'Boletín Oficial', to: '/boletin-oficial' },
] as const;

export const QUERY_KEYS = {
  noticias: 'noticias',
  noticia: 'noticia',
  tramites: 'tramites',
  matriculados: 'matriculados',
  pagoMatricula: 'pago-matricula',
  honorarios: 'honorarios',
  obrasSociales: 'obras-sociales',
  alquileres: 'alquileres',
  boletin: 'boletin-oficial',
  instagram: 'instagram',
} as const;
