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

// ALINEADO CON BACKEND (4.4): campos exactos que devuelve
// GET /api/v1/novedades (app/Controllers/Api/NovedadesController::map).
// El backend modela cada novedad con un único archivo adjunto (archivo_*).
//
// La UI deriva propiedades de presentación a partir de estos campos:
//   - "fecha_publicacion"  → antes el frontend usaba "fecha"
//   - "contenido"          → también se usa como base para un resumen truncado
//   - "archivo_ruta"       → si es una imagen, se usa como imagen destacada
//   - "autor"              → sustituye a la categoría inexistente en el backend
export interface Noticia {
  id: number;
  usuario_id: number | null;
  titulo: string;
  contenido: string;
  publicado: boolean;
  fecha_publicacion: string; // ISO 8601
  archivo_nombre: string | null;
  archivo_contenido: string | null;
  archivo_ruta: string | null;
  archivo_tipo: string | null;
  archivo_tamano: number | null;
  autor: string | null;
  roles_nombres: string | null;
  roles: number[] | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
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

// ALINEADO CON BACKEND (4.4): campos exactos que devuelve
// GET /api/v1/profesionales (app/Controllers/Api/ProfesionalesController::map).
// - "nro_matricula"    → antes "matricula"
// - "nombre"+"apellido"→ antes el frontend usaba un único "nombre"
// - se eliminan "especialidad" (el backend no la expone en esta versión)
export interface Matriculado {
  id: number;
  nro_matricula: string;
  dni: string | null;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  localidad: string | null;
  direccion: string | null;
  estado: string;
  fecha_matriculacion: string;
  observaciones: string | null;
  foto: string | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
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

// ALINEADO CON BACKEND (4.4): campos exactos que devuelve
// GET /api/v1/obras-sociales (app/Controllers/Api/ObrasSocialesController::map).
// - "correo"          → antes "email"
// - "url_sitio_web"   → antes "sitioWeb"
// - "logo" eliminado  → el backend no expone logo; la UI usa el avatar por defecto.
export interface ObraSocial {
  id: number;
  nombre: string;
  descripcion: string | null;
  telefono: string | null;
  correo: string | null;
  url_sitio_web: string | null;
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

// ALINEADO CON BACKEND (4.4): campos exactos que devuelve
// GET /api/v1/boletines-oficiales (app/Controllers/Api/BoletinesOficialesController::map).
// - "resumen"  → antes "descripcion"
// - archivo_*  → el backend modela un único adjunto por publicación
export interface BoletinPublicacion {
  id: number;
  titulo: string;
  resumen: string | null;
  archivo_nombre: string | null;
  archivo_ruta: string | null;
  archivo_tipo: string | null;
  archivo_tamano: number | null;
  archivo_contenido: string | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
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
