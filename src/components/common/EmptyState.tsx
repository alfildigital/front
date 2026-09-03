import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'Sin resultados',
  description = 'No hay información disponible por el momento.',
  icon,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-4 py-16 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
        {icon ?? <Inbox className="h-8 w-8 text-primary-500" aria-hidden="true" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
