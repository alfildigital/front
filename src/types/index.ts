/**
 * Interfaces de dominio de la aplicación.
 *
 * Las interfaces marcadas con [PROVISIONAL] tienen un contrato no definido por el backend.
 * Solo incluyen las propiedades mínimas que la UI necesita en este momento.
 * Cuando backend defina el contrato real:
 *   1. Actualizar la interfaz aquí.
 *   2. Ajustar el service correspondiente en src/api/services/.
 *   3. Las pages y componentes no deberían requerir cambios.
 *
 * Ver src/docs/DECISIONES.md para el registro de cada decisión.
 */

// ---------------------------------------------------------------------------
// NOTICIAS
// ---------------------------------------------------------------------------

export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string | null;
  fecha: string;         // ISO 8601: "2024-03-15T10:30:00Z"
  categoria: string;
  adjuntos: Adjunto[];
}

export interface Adjunto {
  id: number;
  nombre: string;
  url: string;
  tipo: string;          // "pdf" | "docx" | "jpg" | etc.
  tamanio: number;       // bytes
}

// ---------------------------------------------------------------------------
// TRÁMITES — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

export interface Tramite {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos: string[];  // lista de requisitos
  enlace: string | null;
  icono: string | null;  // nombre de ícono Lucide o URL
}

// ---------------------------------------------------------------------------
// MATRICULADOS — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

export interface Matriculado {
  id: number;
  nombre: string;
  matricula: string;
  especialidad: string;
  telefono: string | null;
  email: string | null;
  foto: string | null;
}

// ---------------------------------------------------------------------------
// PAGO MATRÍCULA — contrato definido en el documento de requisitos
// ---------------------------------------------------------------------------

export interface PagoMatriculaData {
  checkoutUrl: string;
}

// ---------------------------------------------------------------------------
// HONORARIOS — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

export interface Honorario {
  id: number;
  titulo: string;
  descripcion: string | null;
  tipo: 'imagen' | 'pdf';
  url: string;
  fecha: string | null;
}

// ---------------------------------------------------------------------------
// OBRAS SOCIALES — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------
// Este tipo define exactamente la forma que la página de obras sociales necesita para renderizar
// cada tarjeta: nombre, contacto y enlace web. Si el backend define nuevos campos, se actualiza
// este tipo y el servicio correspondiente, sin afectar la lógica de la pantalla.

export interface ObraSocial {
  id: number;
  nombre: string;
  logo: string | null;
  descripcion: string | null;
  telefono: string | null;
  email: string | null;
  sitioWeb: string | null;
}



// ---------------------------------------------------------------------------
// ALQUILERES — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

export interface Alquiler {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  direccion: string | null;
  precio: number | null;
  moneda: string;          // "ARS" | "USD"
  disponible: boolean;
  contactoNombre: string | null;
  contactoTelefono: string | null;
  contactoEmail: string | null;
}

// ---------------------------------------------------------------------------
// BOLETÍN OFICIAL — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

export interface BoletinPublicacion {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;           // ISO 8601
  adjuntos: Adjunto[];
}

// ---------------------------------------------------------------------------
// INSTAGRAM — [PROVISIONAL] contrato pendiente de backend
// ---------------------------------------------------------------------------

/**
 * Solo incluye las propiedades que la UI realmente consume.
 * El contrato real del backend puede incluir más campos.
 */
export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string | null;
  permalink: string;
  timestamp: string; // ISO 8601
}
