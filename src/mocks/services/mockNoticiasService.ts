import { mockNoticias } from '@/mocks/data/noticias';
import type { Noticia } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockNoticiasService = {
  getAll: async (): Promise<Noticia[]> => {
    await delay(600);
    return mockNoticias;
  },

  getById: async (id: number): Promise<Noticia> => {
    await delay(400);
    const noticia = mockNoticias.find((n) => n.id === id);
    if (!noticia) throw new Error(`Noticia con id ${id} no encontrada`);
    return noticia;
  },
};
