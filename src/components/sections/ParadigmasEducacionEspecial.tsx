import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Accessibility,
  Activity,
  Ban,
  ChevronRight,
  HeartHandshake,
  Quote,
  Scale,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

interface Paradigma {
  numero: string;
  titulo: string;
  resumen: string;
  contenido: string[];
  conceptos: string[];
  Icon: LucideIcon;
  color: string;
}

const paradigmas: Paradigma[] = [
  {
    numero: '01',
    titulo: 'Modelo de Prescindencia',
    resumen:
      'Durante siglos, la discapacidad fue interpretada desde explicaciones religiosas o morales. La respuesta social predominante era la caridad, la dependencia y la segregación.',
    contenido: [
      'Durante siglos, la discapacidad fue interpretada desde explicaciones religiosas o morales. Se creía que era un castigo o una señal negativa, y que las personas con discapacidad “no tenían nada que aportar a la comunidad”.',
      'Este paradigma justificó prácticas de exclusión extrema: desde políticas eugenésicas hasta la marginación en espacios destinados a “anormales” o pobres.',
      'La respuesta social predominante era la caridad, la dependencia y la segregación.',
    ],
    conceptos: ['Explicaciones religiosas o morales', 'Exclusión', 'Caridad', 'Segregación'],
    Icon: Ban,
    color: 'primary',
  },
  {
    numero: '02',
    titulo: 'Modelo Rehabilitador',
    resumen:
      'Con el avance científico, la discapacidad pasó a considerarse un problema individual. El objetivo era rehabilitar y normalizar a la persona para adaptarla a la sociedad.',
    contenido: [
      'Con el avance científico, la discapacidad dejó de entenderse como castigo y pasó a considerarse un problema individual.',
      'La persona debía ser “rehabilitada” para ajustarse a la norma social.',
      'Según Palacios, este modelo buscaba normalizar a las personas, incluso “forzando la desaparición u ocultamiento de la diferencia”.',
      'La inclusión dependía de la recuperación funcional, y la diversidad era vista como déficit.',
    ],
    conceptos: ['Avance científico', 'Rehabilitación', 'Normalización', 'Déficit'],
    Icon: Activity,
    color: 'secondary',
  },
  {
    numero: '03',
    titulo: 'Modelo Social',
    resumen:
      'La discapacidad comienza a comprenderse en relación con las barreras sociales. El foco pasa a los derechos, la autonomía, la accesibilidad y la participación plena.',
    contenido: [
      'A mediados del siglo XX, impulsado por el movimiento de vida independiente y por las propias personas con discapacidad, surge un cambio radical: la discapacidad no es un problema individual, sino el resultado de barreras sociales.',
      'El modelo social sostiene que las personas con discapacidad pueden aportar a la sociedad “en igual medida que el resto”, siempre desde el respeto a la diferencia.',
      'Este paradigma se vincula directamente con los derechos humanos, la dignidad, la igualdad y la autonomía.',
      'Promueve principios como vida independiente, accesibilidad universal, ajustes razonables y participación plena.',
    ],
    conceptos: ['Derechos humanos', 'Accesibilidad universal', 'Autonomía', 'Participación plena'],
    Icon: Accessibility,
    color: 'primary',
  },
];

const colorStyles = {
  primary: {
    icon: 'bg-primary-100 text-secondary-600 dark:bg-primary-900/30 dark:text-secondary-400',
    marker: 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300',
    accent: 'border-primary-400',
  },
  secondary: {
    icon: 'bg-primary-100 text-secondary-600 dark:bg-primary-900/30 dark:text-secondary-400',
    marker: 'border-secondary-200 bg-secondary-50 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-300',
    accent: 'border-secondary-400',
  },
} as const;

function ParadigmaModal({ paradigma, onClose }: { paradigma: Paradigma; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  const Icon = paradigma.Icon;
  const styles = colorStyles[paradigma.color as keyof typeof colorStyles];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paradigma-modal-title"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 sm:p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Paradigma {paradigma.numero}
              </p>
              <h2 id="paradigma-modal-title" className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                {paradigma.titulo}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Cerrar información sobre ${paradigma.titulo}`}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="space-y-4">
            {paradigma.contenido.map((parrafo) => (
              <p key={parrafo} className="text-sm text-justify leading-7 text-gray-600 dark:text-gray-300">
                {parrafo}
              </p>
            ))}
          </div>

          <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-700">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Ideas centrales
            </p>
            <div className="flex flex-wrap gap-2">
              {paradigma.conceptos.map((concepto) => (
                <span
                  key={concepto}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {concepto}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ParadigmasEducacionEspecial() {
  const [paradigmaAbierto, setParadigmaAbierto] = useState<Paradigma | null>(null);

  return (
    <section aria-labelledby="paradigmas-title" className="overflow-hidden bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-primary-600 dark:text-primary-400">
              <Scale className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">Una mirada histórica</span>
            </div>
            <h2 id="paradigmas-title" className="text-3xl text-justify font-bold leading-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              ¿Sabías que la Educación Especial atravesó distintos paradigmas?
            </h2>
            <p className="mt-5 text-justify text-base text-justify leading-8 text-gray-600 dark:text-gray-300">
              La historia de la discapacidad no es lineal: está marcada por cambios profundos en la forma en que las sociedades interpretaron las causas, el valor y los derechos de las personas con discapacidad.
            </p>
          </div>

          <aside className="border-l-4 border-secondary-400 bg-secondary-50 p-5 dark:bg-secondary-950/40">
            <p className="text-sm text-justify leading-7 text-secondary-900 dark:text-secondary-100">
              Siguiendo la clasificación presentada por Agustina Palacios, pueden reconocerse tres grandes modelos que convivieron en distintos momentos y que todavía influyen en las prácticas educativas y sociales.
            </p>
          </aside>
        </div>

        <div className="relative mt-16">
          <div className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-primary-200 via-secondary-300 to-primary-200 dark:from-primary-800 dark:via-secondary-700 dark:to-primary-800 md:bottom-auto md:left-[16.66%] md:right-[16.66%] md:top-7 md:h-px md:w-auto md:bg-gradient-to-r" aria-hidden="true" />
          <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {paradigmas.map((paradigma) => {
              const Icon = paradigma.Icon;
              const styles = colorStyles[paradigma.color as keyof typeof colorStyles];

              return (
                <article key={paradigma.numero} className="relative pl-14 md:pl-0 md:pt-14">
                  <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm md:left-1/2 md:-translate-x-1/2 dark:border-gray-900 ${styles.marker}`}>
                    <span className="text-xs font-bold">{paradigma.numero}</span>
                  </div>
                  <div className={`h-full rounded-2xl border border-gray-300 border-t-4 bg-gray-50 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60 ${styles.accent}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="text-4xl font-black text-gray-100 dark:text-gray-700">{paradigma.numero}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">{paradigma.titulo}</h3>
                    <p className="mt-3 text-sm text-justify leading-7 text-gray-600 dark:text-gray-300">{paradigma.resumen}</p>
                    <button
                      type="button"
                      onClick={() => setParadigmaAbierto(paradigma)}
                      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200 dark:focus:ring-offset-gray-900"
                    >
                      Conocer este modelo
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-primary-200 bg-primary-50 p-6 sm:p-8 dark:border-primary-800 dark:bg-primary-950/40">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <HeartHandshake className="h-7 w-7" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">Nuestra mirada</span>
              </div>
              <h2 className="text-2xl  font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                ¿Por qué este modelo es clave para el Colegio?
              </h2>
              <p className="mt-4 text-sm text-justify leading-7 text-gray-600 dark:text-gray-300">
                Porque el Colegio de Profesionales de la Educación Especial de Misiones nace y se consolida en este nuevo paradigma.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { Icon: ShieldCheck, titulo: 'Sujetos de derechos', texto: 'Reconoce a las personas con discapacidad como sujetos de derechos.' },
                { Icon: Ban, titulo: 'Eliminar barreras', texto: 'Promueve prácticas educativas que eliminan barreras y generan oportunidades reales.' },
                { Icon: Users, titulo: 'Inclusión y autonomía', texto: 'Acompaña la transición histórica hacia una Educación Especial centrada en la inclusión, la autonomía y la dignidad humana.' },
              ].map(({ Icon, titulo, texto }) => (
                <article key={titulo} className="rounded-xl border border-primary-200 bg-gray-50 p-5 shadow-sm dark:border-primary-900 dark:bg-gray-900/70">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{titulo}</h3>
                  <p className="mt-2 text-sm text-justify leading-6 text-gray-600 dark:text-gray-300">{texto}</p>
                </article>
              ))}
            </div>
          </div>

          <blockquote className="mt-8 flex gap-4 border-t border-primary-200 pt-6 dark:border-primary-800">
            <Quote className="mt-1 h-7 w-7 flex-shrink-0 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
            <p className="text-base font-medium leading-8 text-primary-900 dark:text-primary-100">
              El Colegio se gestó desde esta mirada contemporánea, crítica y profundamente humana: una Educación Especial que ya no “prescinde” ni “rehabilita” como condición para participar, sino que <strong>transforma entornos, prácticas y políticas para garantizar derechos</strong>.
            </p>
          </blockquote>
        </div>
      </div>

      {paradigmaAbierto && (
        <ParadigmaModal paradigma={paradigmaAbierto} onClose={() => setParadigmaAbierto(null)} />
      )}
    </section>
  );
}