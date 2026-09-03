import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';


// determinamos el tipo de usuario que devuelve la API de tipo json para mapearlo a nuestro tipo Matriculado
interface JsonPlaceholderUser{
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

  //formato de la api para response en tipo json.

  export const matriculadosService = {
    getAll: async (): Promise<Matriculado[]> => {
      const { data } = await apiClient.get<ApiResponse<JsonPlaceholderUser[]>>(ENDPOINTS.matriculados.list);
      console.log('Datos recibidos: ', data);
      console.log('Cantidad recibida: ', data.length);
      // mapeamos el array de usuarios de tipo json a nuestro tipo Matriculado 
      return data.map((user)=>({
        params:{
          _limit: 100,
        },
        id: user.id,
        nombre: user.name,
        email: user.email,
        telefono: user.phone,
        direccion: user.website,
        matricula: user.username,
        especialidad: 'Especialidad de ejemplo',
        foto: `https://i.pravatar.cc/150?u=${user.id}`,
      }));
  },

  getPagoData: async (): Promise<PagoMatriculaData> => {
    throw new Error('Not implemented yet');
  },

  getHonorarios: async (): Promise<Honorario[]> => {
    throw new Error('Not implemented yet');
  },
};





/*export const matriculadosService = {
  getAll: async (): Promise<Matriculado[]> => {
    const { data } = await apiClient.get<ApiResponse<Matriculado[]>>(ENDPOINTS.matriculados.list);
    return data.data;
  }, // este formato es para cuando la API devuelve un array de matriculados. si recibimos un array de usuarios de formato json, necesitamos mapearlo a nuestro tipo Matriculado

  getPagoData: async (): Promise<PagoMatriculaData> => {
    const { data } = await apiClient.get<ApiResponse<PagoMatriculaData>>(ENDPOINTS.matriculados.pago);
    return data.data;
  },

  getHonorarios: async (): Promise<Honorario[]> => {
    const { data } = await apiClient.get<ApiResponse<Honorario[]>>(ENDPOINTS.matriculados.honorarios);
    return data.data;
  },
};
*/