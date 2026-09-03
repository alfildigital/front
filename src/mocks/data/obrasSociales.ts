// ===========================================================================
// DATOS MOCK DE OBRAS SOCIALES
// ===========================================================================
// ARCHIVO: src/mocks/data/obrasSociales.ts
//
// PROPÓSITO: Provee datos de prueba estáticos que replican exactamente la estructura
//   que devolvería el endpoint real GET /api/obras-sociales del backend.
//
// CUÁNDO SE USA: Exclusivamente cuando config.mocks.enabled === true,
//   controlado por la variable de entorno VITE_USE_MOCKS=true en el archivo .env.development.
//
// FLUJO DE CONSUMO:
//   obrasSociales.ts (este archivo)
//     ← importado por → mockObrasSocialesService.ts
//       ← seleccionado por → useObrasSociales.ts (si config.mocks.enabled)
//         ← usado por → src/pages/ObrasSociales/index.tsx
//                       src/pages/Home/index.tsx (sección de destacados)
//
// CONTRATO DE DATOS: Cada objeto debe cumplir la interfaz ObraSocial definida en
//   'src/types/index.ts'. Los campos nullable (logo, descripcion, telefono, email, sitioWeb)
//   pueden ser null para testear los renderizados condicionales de la tarjeta.
// ===========================================================================

import type { ObraSocial } from '@/types';

/**
 * Array estático de obras sociales para desarrollo y testing.
 *
 * Cubre los distintos casos de renderizado posibles en la tarjeta:
 *   - Con logo (campo `logo` con URL)           → mostrar <img>
 *   - Sin logo (campo `logo` null)              → mostrar avatar Building2
 *   - Con descripción / sin descripción         → renderizado condicional
 *   - Con todos los contactos                   → teléfono + email + web
 *   - Con contacto parcial                      → solo algunos campos
 *   - Sin ningún contacto                       → sección de contacto vacía
 *
 * Estructura de cada objeto (interfaz ObraSocial):
 *   id:          number       — Identificador único. Usado como `key` en la grilla.
 *   nombre:      string       — Nombre de la obra social. Siempre requerido.
 *   logo:        string|null  — URL de imagen del logo. null → se usa avatar Building2.
 *   descripcion: string|null  — Texto descriptivo. null → sección omitida en la tarjeta.
 *   telefono:    string|null  — Número de contacto. null → no se muestra fila de teléfono.
 *   email:       string|null  — Correo de contacto. null → no se muestra fila de email.
 *   sitioWeb:    string|null  — URL al sitio oficial. null → no se muestra enlace web.
 */
export const mockObrasSociales: ObraSocial[] = [
  // ── 1. OSDE ─────────────────────────────────────────────────────────────
  // Caso: obra social con todos los campos de contacto completos y descripción.
  {
    id: 1,
    nombre: 'OSDE',
    logo: null, // null → la tarjeta renderiza el avatar con ícono Building2
    descripcion:
      'Obra social con amplia cobertura nacional y una de las redes de prestadores más extensas del país.',
    telefono: '0800-555-6733',
    email: 'atencion@osde.com.ar',
    sitioWeb: 'https://www.osde.com.ar',
  },

  // ── 2. Swiss Medical ────────────────────────────────────────────────────
  // Caso: obra social sin email registrado. Testea el renderizado condicional de la fila de email.
  {
    id: 2,
    nombre: 'Swiss Medical',
    logo: null,
    descripcion:
      'Medicina prepaga con cobertura integral y asistencia médica de alta complejidad.',
    telefono: '011-5239-3300',
    email: null, // null → la fila de email NO se renderiza en la tarjeta
    sitioWeb: 'https://www.swissmedical.com.ar',
  },

  // ── 3. IOMA ─────────────────────────────────────────────────────────────
  // Caso: obra social de estado provincial con todos los campos completos.
  {
    id: 3,
    nombre: 'IOMA',
    logo: null,
    descripcion:
      'Instituto de Obra Médico Asistencial de la Provincia de Buenos Aires. Cobertura para agentes del estado bonaerense.',
    telefono: '0800-999-4662',
    email: 'consultas@ioma.gba.gov.ar',
    sitioWeb: 'https://www.ioma.gba.gov.ar',
  },

  // ── 4. Medicus ──────────────────────────────────────────────────────────
  // Caso: obra social sin email registrado.
  {
    id: 4,
    nombre: 'Medicus',
    logo: null,
    descripcion:
      'Medicina prepaga con más de 50 años de trayectoria, enfocada en prevención y calidad de atención.',
    telefono: '011-5238-0000',
    email: null,
    sitioWeb: 'https://www.medicus.com.ar',
  },

  // ── 5. Galeno ───────────────────────────────────────────────────────────
  // Caso: obra social con todos los campos de contacto completos.
  {
    id: 5,
    nombre: 'Galeno',
    logo: null,
    descripcion:
      'Cobertura médica integral con presencia en todo el país y planes adaptados a cada necesidad.',
    telefono: '0800-888-4253',
    email: 'atencionalafiliado@galeno.com.ar',
    sitioWeb: 'https://www.galeno.com.ar',
  },

  // ── 6. Accord Salud ─────────────────────────────────────────────────────
  // Caso: obra social sin teléfono registrado. Testea el renderizado condicional de la fila de teléfono.
  {
    id: 6,
    nombre: 'Accord Salud',
    logo: null,
    descripcion:
      'Prepaga con cobertura en servicios de salud mental, kinesiología y especialidades ambulatorias.',
    telefono: null, // null → la fila de teléfono NO se renderiza en la tarjeta
    email: 'info@accord.com.ar',
    sitioWeb: 'https://www.accord.com.ar',
  },

  // ── 7. PAMI ─────────────────────────────────────────────────────────────
  // Caso: obra social de jubilados con teléfono gratuito y todos los campos.
  {
    id: 7,
    nombre: 'PAMI',
    logo: null,
    descripcion:
      'Programa de Atención Médica Integral. Cobertura para jubilados y pensionados de la Argentina.',
    telefono: '0800-222-7264',
    email: null,
    sitioWeb: 'https://www.pami.org.ar',
  },

  // ── 8. Federada Salud ───────────────────────────────────────────────────
  // Caso: obra social con todos los campos completos.
  {
    id: 8,
    nombre: 'Federada Salud',
    logo: null,
    descripcion:
      'Cobertura médica con amplia red de prestadores en el interior del país.',
    telefono: '0810-777-3252',
    email: 'consultas@federadasalud.com.ar',
    sitioWeb: 'https://www.federadasalud.com.ar',
  },

  // ── 9. OSPEDYC ──────────────────────────────────────────────────────────
  // Caso: obra social sindical con descripción detallada y contacto parcial.
  {
    id: 9,
    nombre: 'OSPEDYC',
    logo: null,
    descripcion:
      'Obra Social del Personal de Entidades Deportivas y Civiles. Atención para empleados del sector.',
    telefono: '011-4322-9200',
    email: null,
    sitioWeb: 'https://www.ospedyc.org.ar',
  },

  // ── 10. OSECAC ──────────────────────────────────────────────────────────
  // Caso: obra social sindical del sector comercial.
  {
    id: 10,
    nombre: 'OSECAC',
    logo: null,
    descripcion:
      'Obra Social de Empleados de Comercio y Actividades Civiles. Cobertura para trabajadores del comercio.',
    telefono: '0800-333-0500',
    email: 'afiliados@osecac.org.ar',
    sitioWeb: 'https://www.osecac.org.ar',
  },

  // ── 11. OBRA SOCIAL SIN DATOS DE CONTACTO ───────────────────────────────
  // Caso extremo: obra social con todos los campos de contacto en null.
  // Testea que la sección de contacto se renderiza vacía correctamente (sin filas visibles).
  {
    id: 11,
    nombre: 'Obra Social en Convenio',
    logo: null,
    descripcion:
      'Información de contacto en proceso de actualización. Consultá en la sede del colegio.',
    telefono: null, // → fila teléfono oculta
    email: null,    // → fila email oculta
    sitioWeb: null, // → enlace web oculto
  },

  // ── 12. OBRA SOCIAL SOLO CON NOMBRE ─────────────────────────────────────
  // Caso extremo: obra social sin descripción y sin ningún contacto.
  // Testea el renderizado mínimo de la tarjeta (solo avatar + nombre).
  {
    id: 12,
    nombre: 'Mutual Educadores',
    logo: null,
    descripcion: null, // → bloque de descripción no se monta en el DOM
    telefono: null,
    email: null,
    sitioWeb: null,
  },
];
