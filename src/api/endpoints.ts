/**
 * URLs de todos los endpoints de la API.
 * Centralizado para facilitar cambios y evitar strings dispersos.
 *
 * ALINEACIÓN CON EL BACKEND (4.1):
 * El backend (cpee) es la fuente de verdad y SOLO consume estos recursos
 * bajo /api/v1:
 *   - novedades            (noticias del frontend)
 *   - profesionales        (matriculados del frontend)
 *   - boletines-oficiales  (boletín oficial del frontend)
 *   - obras-sociales
 *
 * Los nombres de recurso aquí DEBEN coincidir exactamente con los
 * controladores de /var/www/html/cpee/app/Controllers/Api/.
 */
export const ENDPOINTS = {
  // Noticias → GET /api/v1/novedades
  noticias: {
    list: '/novedades',
    detail: (id: number) => `/novedades/${id}`,
  },
  tramites: {
    list: '/tramites',
  },
  // Matriculados → GET /api/v1/profesionales
  matriculados: {
    list: '/profesionales',
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
  // Boletín oficial → GET /api/v1/boletines-oficiales
  boletin: {
    list: '/boletines-oficiales',
  },
  instagram: {
    list: '/instagram',
  },
} as const;
