/// <reference types="vite/client" />

/**
 * Tipado de las variables de entorno de Vite.
 * Permite que TypeScript valide el acceso a import.meta.env.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_ENABLE_LOGS: string;
  readonly VITE_USE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
