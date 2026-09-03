/**
 * Configuración centralizada de la aplicación.
 * Todas las variables de entorno se consumen aquí.
 * Las páginas y servicios NO deben acceder directamente a import.meta.env.
 */
export const config = {
  api: {
    url: import.meta.env.VITE_API_URL as string,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  },
  whatsapp: {
    number: import.meta.env.VITE_WHATSAPP_NUMBER as string,
  },
  logs: {
    enabled: import.meta.env.VITE_ENABLE_LOGS === 'true',
  },
  // Si VITE_USE_MOCKS=true, el flujo de obras sociales usa datos locales simulados
  // en lugar de llamar al backend real. Esto sirve para desarrollo y pruebas sin depender
  // del servidor API. El resto de la app mantiene el mismo patrón de configuración.
  mocks: {
    enabled: import.meta.env.VITE_USE_MOCKS === 'false',
  },
} as const;
