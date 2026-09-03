/**
 * URLs de todos los endpoints de la API.
 * Centralizado para facilitar cambios y evitar strings dispersos.
 */
export const ENDPOINTS = {
  noticias: {
    list: '/noticias',
    detail: (id: number) => `/noticias/${id}`,
  },
  tramites: {
    list: '/tramites',
  },
  matriculados: {
    list: '/users',
    pago: '/posts',
    honorarios: '/posts',
  },
  // Obras sociales:
  // El endpoint listado es la fuente de datos real para la página de Obras Sociales.
  // El nombre del recurso queda centralizado aquí para evitar strings duplicados en la app.
  obrasSociales: {
    list: '/obras-sociales',
  },
  alquileres: {
    list: '/alquileres',
  },
  boletin: {
    list: '/boletin-oficial',
  },
  instagram: {
    list: '/instagram',
  },
} as const;
