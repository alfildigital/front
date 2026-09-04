/**
 * Configuración centralizada de la aplicación.
 * Todas las variables de entorno se consumen aquí.
 * Las páginas y servicios NO deben acceder directamente a import.meta.env.
 */
export const config = {
  api: {
    url: import.meta.env.VITE_API_URL as string,
    // API Key del backend (header "Authorization: Bearer <clave>").
    // El backend (cpee) exige este token en TODAS  las peticiones a /api/v1.
    // Se inyecta como header global en 'src/api/client.ts'.
    apiKey: import.meta.env.VITE_APP_API_KEY as string,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  },
  whatsapp: {
    number: import.meta.env.VITE_WHATSAPP_NUMBER as string,
  },
  logs: {
    enabled: import.meta.env.VITE_ENABLE_LOGS === 'true',
  },
  // Si VITE_USE_MOCKS=true, los hooks usan datos locales simulados en lugar de
  // llamar al backend real. Sirve para desarrollo y pruebas sin depender del servidor API.
  //
  // CORRECCIÓN (4.3): antes estaba "=== 'false'" (invertido), lo que hacía que
  //   VITE_USE_MOCKS=true desactivara los mocks e intentara conectar con la API real.
  //   Ahora 'true' activa los mocks y 'false' usa la API real.
  mocks: {
    enabled: import.meta.env.VITE_USE_MOCKS === 'true',
  },
} as const;
