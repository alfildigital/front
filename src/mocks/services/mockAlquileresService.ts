import { mockAlquileres } from '@/mocks/data/alquileres';
import type { Alquiler } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAlquileresService = {
  getAll: async (): Promise<Alquiler[]> => {
    await delay(600);
    return mockAlquileres;
  },
};
