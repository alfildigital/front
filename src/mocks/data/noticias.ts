import type { Noticia } from '@/types';

export const mockNoticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Nueva reglamentación para el ejercicio profesional 2024',
    resumen:
      'El Colegio informa sobre los cambios en la reglamentación vigente que afectan al ejercicio de la profesión a partir del próximo ciclo.',
    contenido: `<h2>Nuevas disposiciones</h2><p>A partir del 1° de enero de 2025, entrarán en vigencia las siguientes modificaciones al reglamento de ejercicio profesional:</p><ul><li>Actualización del sistema de habilitaciones</li><li>Nuevos requisitos para la renovación de matrícula</li><li>Protocolo de actuación ante conflictos de interés</li></ul><p>Los profesionales matriculados deberán adecuarse a estas disposiciones antes del 31 de marzo de 2025.</p>`,
    imagen: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop',
    fecha: '2024-11-15T10:00:00Z',
    categoria: 'Normativa',
    adjuntos: [
      {
        id: 1,
        nombre: 'Reglamento 2024.pdf',
        url: '#',
        tipo: 'pdf',
        tamanio: 245760,
      },
    ],
  },
  {
    id: 2,
    titulo: 'Jornada de actualización profesional — Noviembre 2024',
    resumen:
      'Invitamos a todos los matriculados a participar de la jornada anual de actualización. Cupos limitados.',
    contenido: `<h2>Jornada anual</h2><p>Se realizará el próximo 28 de noviembre en nuestra sede central. La actividad es gratuita para matriculados con cuota al día.</p><p>Temática: Nuevas tecnologías aplicadas a la práctica profesional.</p>`,
    imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    fecha: '2024-10-28T09:00:00Z',
    categoria: 'Eventos',
    adjuntos: [],
  },
  {
    id: 3,
    titulo: 'Actualización de honorarios mínimos',
    resumen:
      'El Consejo Directivo aprobó la actualización de la escala de honorarios mínimos con vigencia inmediata.',
    contenido: `<h2>Nuevos valores</h2><p>La actualización refleja la variación del índice de precios al consumidor del tercer trimestre de 2024.</p>`,
    imagen: null,
    fecha: '2024-09-03T14:00:00Z',
    categoria: 'Honorarios',
    adjuntos: [],
  },
];
