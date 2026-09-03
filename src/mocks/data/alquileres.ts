import type { Alquiler } from '@/types';

export const mockAlquileres: Alquiler[] = [
  {
    id: 1,
    titulo: 'Consultorio individual — Microcentro',
    descripcion: 'Consultorio de 20 m², totalmente equipado, excelente ubicación en el microcentro portento. Incluyendo sala de espera compartida.',
    imagen: 'https://images.unsplash.com/photo-1629236714692-9d6ea6e7eb0e?w=800&auto=format&fit=crop',
    direccion: 'Av. Corrientes 1200, CABA',
    precio: 150000,
    moneda: 'ARS',
    disponible: true,
    contactoNombre: 'Administración del Colegio',
    contactoTelefono: '011-4321-5678',
    contactoEmail: 'alquileres@colegio.com.ar',
  },
  {
    id: 2,
    titulo: 'Sala de reuniones — Sede central',
    descripcion: 'Sala con capacidad para 12 personas, proyector, pizarrón y servicio de café. Disponible por franja horaria.',
    imagen: null,
    direccion: 'Sede Central del Colegio',
    precio: 8000,
    moneda: 'ARS',
    disponible: true,
    contactoNombre: 'Recepción',
    contactoTelefono: '011-4321-5679',
    contactoEmail: null,
  },
];
