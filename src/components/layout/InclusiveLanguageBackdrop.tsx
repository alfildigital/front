import type { CSSProperties } from 'react';
import './InclusiveLanguageBackdrop.css';

const particles = [
  { symbol: '👋', type: 'gesture', left: 7, top: 18, drift: 12, delay: -3 },
  { symbol: '⠿', type: 'braille', left: 15, top: 62, drift: -8, delay: -8 },
  { symbol: '🤟', type: 'gesture', left: 24, top: 38, drift: 10, delay: -5 },
  { symbol: '⠁', type: 'braille', left: 32, top: 72, drift: -13, delay: -1 },
  { symbol: '🤲', type: 'gesture', left: 40, top: 12, drift: 9, delay: -10 },
  { symbol: '⠃', type: 'braille', left: 48, top: 56, drift: -11, delay: -6 },
  { symbol: '✋', type: 'gesture', left: 57, top: 29, drift: 14, delay: -2 },
  { symbol: '⠉', type: 'braille', left: 65, top: 76, drift: -9, delay: -9 },
  { symbol: '👋', type: 'gesture', left: 73, top: 48, drift: 11, delay: -4 },
  { symbol: '⠙', type: 'braille', left: 82, top: 20, drift: -12, delay: -7 },
  { symbol: '🤟', type: 'gesture', left: 91, top: 67, drift: 8, delay: -11 },
  { symbol: '⠑', type: 'braille', left: 97, top: 41, drift: -10, delay: -2 },
];

export function InclusiveLanguageBackdrop() {
  return (
    <div className="inclusive-language-backdrop" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          className={`inclusive-language-particle is-${particle.type}`}
          key={`${particle.symbol}-${index}`}
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              '--particle-drift': `${particle.drift}px`,
            } as CSSProperties
          }
        >
          {particle.symbol}
        </span>
      ))}
    </div>
  );
}