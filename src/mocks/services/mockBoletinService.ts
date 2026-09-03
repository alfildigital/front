import { mockBoletin } from '@/mocks/data/boletin';
import type { BoletinPublicacion } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockBoletinService = {
  getAll: async (): Promise<BoletinPublicacion[]> => {
    await delay(500);
    return mockBoletin;
  },
};
