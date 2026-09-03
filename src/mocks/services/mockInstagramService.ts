import { mockInstagramPosts } from '@/mocks/data/instagram';
import type { InstagramPost } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockInstagramService = {
  getPosts: async (): Promise<InstagramPost[]> => {
    await delay(800);
    return mockInstagramPosts;
  },
};
