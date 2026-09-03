import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { instagramService } from '@/api/services/instagramService';
import { mockInstagramService } from '@/mocks/services/mockInstagramService';
import type { InstagramPost } from '@/types';

const service = config.mocks.enabled ? mockInstagramService : instagramService;

export function useInstagram() {
  return useQuery<InstagramPost[]>({
    queryKey: [QUERY_KEYS.instagram],
    queryFn: service.getPosts,
    // Si no hay posts, la sección se oculta (ver Home)
    staleTime: 15 * 60 * 1000, // 15 min — Instagram no cambia tan seguido
  });
}
