import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';

export const mockMatriculados: Matriculado[] = [
  {
    id: 1,
    nombre: 'Dra. María González',
    matricula: 'MP-1234',
    especialidad: 'Medicina General',
    telefono: '011-4523-7890',
    email: 'mgonzalez@example.com',
    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Fernández',
    matricula: 'MP-5678',
    especialidad: 'Cardiología',
    telefono: '011-4761-2345',
    email: 'cfernandez@example.com',
    foto: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    nombre: 'Lic. Ana López',
    matricula: 'MP-9012',
    especialidad: 'Nutrición',
    telefono: null,
    email: 'alopez@example.com',
    foto: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 4,
    nombre: 'Dr. Roberto Mártinez',
    matricula: 'MP-3456',
    especialidad: 'Pediatría',
    telefono: '011-4892-6543',
    email: null,
    foto: null,
  },
];

export const mockPagoData: PagoMatriculaData = {
  checkoutUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_PREFERENCE_ID',
};

export const mockHonorarios: Honorario[] = [
  {
    id: 1,
    titulo: 'Tabla de Honorarios 2024 — Categoría A',
    descripcion: 'Honorarios mínimos para consultas y procedimientos ambulatorios.',
    tipo: 'pdf',
    url: '#',
    fecha: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    titulo: 'Escala de Honorarios — Cirugías',
    descripcion: null,
    tipo: 'pdf',
    url: '#',
    fecha: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    titulo: 'Resolución honorarios Q3 2024',
    descripcion: 'Actualización trimestral según IPC.',
    tipo: 'imagen',
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop',
    fecha: '2024-09-01T00:00:00Z',
  },
];
