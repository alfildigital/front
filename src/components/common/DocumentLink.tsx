// components/DocumentLink.tsx
import { FileText, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface DocumentLinkProps {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function DocumentLink({
  href,
  children,
  icon: Icon = FileText,
  className = '',
}: DocumentLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mb-5 inline-flex items-center gap-2 rounded-lg border border-primary-400 bg-white/10 mt-4 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 dark:text-gray-100 ${className}`}
    >
      <Icon className="h-4 w-4 text-secondary-300" aria-hidden="true" />
      {children}
    </a>
  );
}