import type { BoletinPublicacion } from '@/types';

// ALINEADO CON BACKEND (4.4): campos que replica GET /api/v1/boletines-oficiales.
export const mockBoletin: BoletinPublicacion[] = [
  {
    id: 1,
    titulo: 'Resolución N° 142/2024 — Actualización de Honorarios',
    resumen:
      'El Consejo Directivo resuelve actualizar los honorarios mínimos profesionales con vigencia a partir del 1° de octubre de 2024.',
    archivo_nombre: 'Resolucion-142-2024.pdf',
    archivo_ruta: null,
    archivo_tipo: 'application/pdf',
    archivo_tamano: 102400,
    archivo_contenido: 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjIwNgolJUVPRg==',
    usuario_abm: 'admin',
    created_at: '2024-10-01T09:00:00Z',
    updated_at: '2024-10-01T09:00:00Z',
  },
  {
    id: 2,
    titulo: 'Convocatoria a Asamblea Ordinaria 2024',
    resumen:
      'Se convoca a todos los matriculados a la Asamblea Ordinaria Anual a realizarse el día 15 de noviembre de 2024 a las 18:00 hs.',
    archivo_nombre: null,
    archivo_ruta: null,
    archivo_tipo: null,
    archivo_tamano: null,
    archivo_contenido: null,
    usuario_abm: 'admin',
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: 3,
    titulo: 'Nota informativa sobre nuevos requisitos AFIP',
    resumen:
      'Se informa a los matriculados sobre los nuevos requisitos establecidos por AFIP para la facturación de servicios profesionales.',
    archivo_nombre: 'Circular-AFIP.pdf',
    archivo_ruta: '#',
    archivo_tipo: 'application/pdf',
    archivo_tamano: 55000,
    archivo_contenido: null,
    usuario_abm: 'admin',
    created_at: '2024-09-20T00:00:00Z',
    updated_at: '2024-09-20T00:00:00Z',
  },
];
