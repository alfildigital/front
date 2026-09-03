import { describe, it, expect } from 'vitest';
import { formatDate, formatFileSize, formatMoney, truncateText, buildWhatsAppUrl } from '@/utils/formatters';

describe('formatDate', () => {
  it('formatea una fecha ISO 8601 en español', () => {
    const result = formatDate('2024-03-15T10:00:00Z');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('devuelve el string original si la fecha es inválida', () => {
    expect(formatDate('no-es-fecha')).toBe('no-es-fecha');
  });
});

describe('formatFileSize', () => {
  it('formatea bytes correctamente', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(1048576)).toBe('1.00 MB');
  });
});

describe('formatMoney', () => {
  it('formatea un monto en ARS', () => {
    const result = formatMoney(15000, 'ARS');
    expect(result).toContain('15');
  });
});

describe('truncateText', () => {
  it('no trunca si el texto es más corto que el límite', () => {
    expect(truncateText('hola', 10)).toBe('hola');
  });

  it('trunca y agrega ellipsis', () => {
    const result = truncateText('texto muy largo que debe ser truncado', 10);
    expect(result).toHaveLength(13); // 10 chars + '...'
    expect(result).toEndWith('...');
  });
});

describe('buildWhatsAppUrl', () => {
  it('genera una URL de WhatsApp válida', () => {
    const url = buildWhatsAppUrl('5491123456789', 'Hola');
    expect(url).toContain('wa.me/5491123456789');
    expect(url).toContain('Hola');
  });
});
