import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/config/constants';
import { Leaf } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {year} {SITE_NAME}. Todos los derechos reservados.
          </p>
          {/* Links legales */}
          <nav aria-label="Links legales" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              to="/terminos-y-condiciones"
              className="text-xs text-gray-400 hover:text-primary-600 hover:underline dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
            >
              Términos y Condiciones
            </Link>
            <span className="text-xs text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
            <Link
              to="/politica-de-privacidad"
              className="text-xs text-gray-400 hover:text-primary-600 hover:underline dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
            >
              Política de Privacidad
            </Link>
          </nav>
          <p className="text-xs flex items-center gap-1">
            <Leaf className="h-3 w-3 text-secondary-400" aria-hidden="true" />
            <span>Modo sustentable disponible</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

