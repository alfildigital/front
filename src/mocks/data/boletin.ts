import type { BoletinPublicacion } from '@/types';

export const mockBoletin: BoletinPublicacion[] = [
  {
    id: 1,
    titulo: 'Resolución N° 142/2024 — Actualización de Honorarios',
    descripcion: 'El Consejo Directivo resuelve actualizar los honorarios mínimos profesionales con vigencia a partir del 1° de octubre de 2024.',
    fecha: '2024-10-01T09:00:00Z',
    adjuntos: [
      {
        id: 1,
        nombre: 'Resolución 142-2024.pdf',
        url: '#',
        tipo: 'pdf',
        tamanio: 102400,
      },
    ],
  },
  {
    id: 2,
    titulo: 'Convocatoria a Asamblea Ordinaria 2024',
    descripcion: 'Se convoca a todos los matriculados a la Asamblea Ordinaria Anual a realizarse el día 15 de noviembre de 2024 a las 18:00 hs.',
    fecha: '2024-10-15T00:00:00Z',
    adjuntos: [],
  },
  {
    id: 3,
    titulo: 'Nota informativa sobre nuevos requisitos AFIP',
    descripcion: 'Se inform a los matriculados sobre los nuevos requisitos establecidos por AFIP para la facturación de servicios profesionales.',
    fecha: '2024-09-20T00:00:00Z',
    adjuntos: [
      {
        id: 2,
        nombre: 'Circular AFIP.pdf',
        url: '#',
        tipo: 'pdf',
        tamanio: 55000,
      },
    ],
  },
];
