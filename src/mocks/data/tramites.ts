import type { Tramite } from '@/types';

export const mockTramites: Tramite[] = [
  {
    id: 1,
    titulo: 'Inscripción de Matrícula',
    descripcion: 'Procedimiento para la inscripción inicial de la matrícula profesional.',
    requisitos: [
      'DNI (original y copia)',
      'Título habilitante legalizado',
      'Foto tipo carnet (4x4)',
      'Constancia de domicilio',
      'Pago de arancel de inscripción',
    ],
    enlace: null,
    icono: 'BadgeCheck',
  },
  {
    id: 2,
    titulo: 'Renovación de Matrícula',
    descripcion: 'Renovación anual de la habilitación profesional.',
    requisitos: [
      'Cuota anual al día',
      'Formulario de renovación completo',
      'Actualización de datos de contacto',
    ],
    enlace: null,
    icono: 'RefreshCw',
  },
  {
    id: 3,
    titulo: 'Certificado de Habilitación',
    descripcion: 'Solicitud de certificado para presentación ante organismos públicos o privados.',
    requisitos: [
      'Matrícula vigente',
      'Cuota al día',
      'Completar formulario de solicitud',
    ],
    enlace: null,
    icono: 'FileCheck',
  },
  {
    id: 4,
    titulo: 'Legalización de Documentos',
    descripcion: 'Servicio de legalización de documentos profesionales ante el Colegio.',
    requisitos: [
      'Documento original a legalizar',
      'Matrícula vigente',
      'Pago de arancel correspondiente',
    ],
    enlace: null,
    icono: 'Stamp',
  },
];
