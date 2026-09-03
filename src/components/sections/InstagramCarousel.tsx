import { ExternalLink } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import type { InstagramPost } from '@/types';

interface InstagramCarouselProps {
  posts: InstagramPost[];
}

export function InstagramCarousel({ posts }: InstagramCarouselProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-label="Publicaciones de Instagram" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seguinos en Instagram</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Últimas publicaciones</p>
          </div>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Ver perfil
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.caption ?? `Publicación del ${formatDate(post.timestamp)}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={post.imageUrl}
                alt={post.caption ?? ''}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />
              {post.caption && (
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="line-clamp-3 text-xs text-white">{post.caption}</p>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
