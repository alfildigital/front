import type { InstagramPost } from '@/types';

export const mockInstagramPosts: InstagramPost[] = [
  {
    id: 'IG001',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&auto=format&fit=crop',
    caption: 'Jornada de actualización profesional. Gracias a todos los asistentes! #colegio #profesionales',
    permalink: 'https://www.instagram.com/p/example1',
    timestamp: '2024-11-10T14:00:00Z',
  },
  {
    id: 'IG002',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&auto=format&fit=crop',
    caption: 'Nueva sede habilitada en zona norte. 🏥',
    permalink: 'https://www.instagram.com/p/example2',
    timestamp: '2024-10-28T10:30:00Z',
  },
  {
    id: 'IG003',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop',
    caption: 'Capacitación en nuevas técnicas. Inscripciones abiertas.',
    permalink: 'https://www.instagram.com/p/example3',
    timestamp: '2024-10-15T16:00:00Z',
  },
  {
    id: 'IG004',
    imageUrl: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&auto=format&fit=crop',
    caption: null,
    permalink: 'https://www.instagram.com/p/example4',
    timestamp: '2024-09-30T12:00:00Z',
  },
];
