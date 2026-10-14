import { Instagram } from 'lucide-react';

export const InstagramBtn = () => {
  return (
    <div className="mt-8 flex justify-center lg:justify-start">
      <a
        href="https://www.instagram.com/colegioedespecial.msn?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 transparent rounded-full border border-primary-200 bg-gradient-to-br from-[#4f5bd5] via-[#d62990] to-[#feda75] px-4 py-2 text-white transition-colors hover:border-primary-300 hover:bg-primary-500 hover:text-primary-500 dark:border-primary-800 dark:text-white dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
      >
        <Instagram className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-medium">Seguinos en Instagram</span>
      </a>
    </div>
  );
};