import { mockTramites } from '@/mocks/data/tramites';
import type { Tramite } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockTramitesService = {
  getAll: async (): Promise<Tramite[]> => {
    await delay(500);
    return mockTramites;
  },
};
