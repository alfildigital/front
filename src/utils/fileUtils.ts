import type { Noticia } from '@/types';

function imageB64(contenido: string | null, tipo: string | null): string | null {
  if (!contenido) return null;
  if (tipo == null || tipo.startsWith('image/')) {
    return `data:${tipo ?? 'image/png'};base64,${contenido}`;
  }
  return null;
}

export function noticiaImagen(n: Noticia): string | null {
  const imgB64 = imageB64(n.img_contenido, n.img_tipo);
  if (imgB64) return imgB64;
  if (n.img_ruta && /^https?:\/\//i.test(n.img_ruta)) return n.img_ruta;
  const archivoB64 = imageB64(n.archivo_contenido, n.archivo_tipo);
  if (archivoB64) return archivoB64;
  if (n.archivo_ruta && /^https?:\/\//i.test(n.archivo_ruta)) return n.archivo_ruta;
  return null;
}

export function noticiaResumen(n: Noticia): string {
  return n.contenido.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function base64ToBlobUrl(base64: string, mime: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  return URL.createObjectURL(blob);
}