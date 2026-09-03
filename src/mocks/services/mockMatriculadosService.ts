import { mockMatriculados, mockPagoData, mockHonorarios } from '@/mocks/data/matriculados';
import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMatriculadosService = {
  getAll: async (): Promise<Matriculado[]> => {
    await delay(700);
    return mockMatriculados;
  },

  getPagoData: async (): Promise<PagoMatriculaData> => {
    await delay(400);
    return mockPagoData;
  },

  getHonorarios: async (): Promise<Honorario[]> => {
    await delay(500);
    return mockHonorarios;
  },
};
