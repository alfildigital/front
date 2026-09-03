import { SITE_NAME } from '@/config/constants';
import { Leaf } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {year} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <p className="text-xs flex items-center gap-1">
            <Leaf className="h-3 w-3 text-secondary-400" aria-hidden="true" />
            <span>Modo sustentable disponible</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
