import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

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
    numero: "01",
    titulo: "Modelo de Prescindencia",
    resumen:
      "Durante la Antigüedad y gran parte de la Edad Media, la discapacidad fue interpretada desde explicaciones religiosas, morales o sobrenaturales. La diferencia era vista como un problema individual o una condición desafortunada que debía ser apartada, controlada o tutelada por otros.",
    contenido: [
      "Durante la Antigüedad y gran parte de la Edad Media, la discapacidad fue interpretada desde explicaciones religiosas, morales o sobrenaturales. En distintos momentos históricos se consideró que las personas con discapacidad no podían contribuir a la comunidad, lo que legitimó prácticas de eliminación, abandono o marginación.",
      "En la Antigüedad, algunas sociedades desarrollaron prácticas eugenésicas que justificaban la exclusión de quienes eran considerados diferentes. Más tarde, durante la Edad Media, predominó una mirada asistencial y caritativa: las personas con discapacidad eran objeto de compasión y dependencia, pero permanecían alejadas de la participación plena en la vida social.",
      "La diferencia era vista como un problema individual o una condición desafortunada que debía ser apartada, controlada o tutelada por otros.",
    ],
    conceptos: [
      "Explicaciones religiosas y morales",
      "Exclusión",
      "Caridad",
      "Marginación",
    ],
    Icon: Ban,
    color: "primary",
  },
  {
    numero: "02",
    titulo: "Modelo Rehabilitador",
    resumen:
      "Entre los siglos XIX y XX la discapacidad comenzó a entenderse como una condición individual que debía ser corregida, compensada o rehabilitada. La inclusión social dependía de la capacidad de la persona para aproximarse a los parámetros considerados normales.",
    contenido: [
      "Entre los siglos XIX y XX, y especialmente después de la Primera y la Segunda Guerra Mundial, el avance de la medicina y la rehabilitación transformó la forma de comprender la discapacidad.",
      "Miles de personas regresaron de los conflictos bélicos con secuelas físicas permanentes, impulsando el desarrollo de tratamientos, prótesis y sistemas de rehabilitación. La discapacidad comenzó a entenderse como una condición individual que debía ser corregida, compensada o rehabilitada.",
      "La inclusión social dependía, en gran medida, de la capacidad de la persona para aproximarse a los parámetros considerados normales. La Educación Especial se desarrolló fuertemente bajo este paradigma, con un enfoque centrado en el diagnóstico, la recuperación funcional y la adaptación individual.",
      "Durante este período también se consolidaron herramientas de medición, evaluación y clasificación que buscaban cuantificar las diferencias humanas. Los test de inteligencia, las categorías diagnósticas y diversos sistemas de valoración permitieron ordenar y clasificar a las personas según su cercanía o alejamiento respecto de un ideal de normalidad.",
      "En este contexto, la Organización Mundial de la Salud publicó en 1980 la Clasificación Internacional de Deficiencias, Discapacidades y Minusvalías (CIDDM), basada en una comprensión predominantemente médica e individual de la discapacidad.",
      "Desde las perspectivas críticas actuales, estos sistemas son analizados no sólo como instrumentos técnicos, sino también como parte de procesos históricos que contribuyeron a establecer categorías de normalidad y anormalidad, favoreciendo formas de estigmatización, segregación y exclusión social.",
    ],
    conceptos: [
      "Rehabilitación",
      "Normalización",
      "Diagnóstico",
      "Clasificación",
    ],
    Icon: Activity,
    color: "secondary",
  },
  {
    numero: "03",
    titulo: "Modelo Social",
    resumen:
      "A finales de los años 60 y durante los 70, las propias personas con discapacidad comenzaron a cuestionar esta mirada. El modelo social sostiene que la discapacidad surge de las barreras físicas, comunicacionales, actitudinales e institucionales que limitan la participación.",
    contenido: [
      "A finales de la década de 1960 y durante los años 70, las propias personas con discapacidad comenzaron a cuestionar esta mirada.",
      "Impulsados por el Movimiento de Vida Independiente en Estados Unidos y por organizaciones como UPIAS en el Reino Unido, surgió una nueva pregunta: ¿La dificultad está en la persona o en la sociedad que no contempla la diversidad humana?",
      "Así nació el modelo social, que sostiene que la discapacidad no surge únicamente de una condición individual, sino de las barreras físicas, comunicacionales, actitudinales e institucionales que limitan la participación.",
      "Esta transformación incorporó conceptos fundamentales como accesibilidad, vida independiente, participación, diseño universal y ajustes razonables.",
      "A finales del siglo XX, diferentes organismos internacionales comenzaron a revisar los límites de los enfoques exclusivamente médicos. En ese contexto, la OMS publicó en 2001 la Clasificación Internacional del Funcionamiento, de la Discapacidad y de la Salud (CIF), incorporando factores contextuales y ambientales en la comprensión de la discapacidad.",
      "Sin embargo, diversos autores y autoras señalan que, aunque la CIF amplía la mirada, continúa organizando la comprensión de las personas a partir de categorías de funcionamiento y parámetros normativos que mantienen la influencia del pensamiento biomédico.",
      "Uno de los mayores logros de este proceso fue la aprobación de la Convención sobre los Derechos de las Personas con Discapacidad, adoptada por las Naciones Unidas en 2006, un hito histórico que reconoció a las personas con discapacidad como sujetos plenos de derechos y consolidó internacionalmente los principios de participación, igualdad y no discriminación.",
    ],
    conceptos: [
      "Barreras sociales",
      "Accesibilidad",
      "Vida independiente",
      "Ajustes razonables",
    ],
    Icon: Accessibility,
    color: "primary",
  },
  {
    numero: "04",
    titulo: "Modelo Crítico y de Derechos Humanos",
    resumen:
      "Los debates contemporáneos muestran que identificar barreras es indispensable, pero no siempre suficiente. La inclusión se convierte en un desafío colectivo: transformar instituciones, prácticas, culturas y políticas para garantizar el pleno ejercicio de los derechos humanos.",
    contenido: [
      "Si bien el modelo social transformó profundamente nuestra comprensión de la discapacidad, los debates contemporáneos muestran que identificar barreras es indispensable, pero no siempre suficiente. Autores como Liliana Pantano, Colin Barnes, Len Barton, Patricia Brogna y los Estudios Críticos en Discapacidad han ampliado esta mirada, entendiendo la discapacidad como una realidad compleja donde interactúan factores personales, sociales, culturales, económicos, institucionales y políticos.",
      "Desde esta perspectiva se distinguen dos conceptos fundamentales: la condición de discapacidad, que refiere a las características particulares, funcionales o de salud de cada persona; y la situación de discapacidad, que surge cuando esas características interactúan con barreras, restricciones o ausencia de apoyos, limitando la participación en igualdad de condiciones. La discapacidad, entonces, no se encuentra exclusivamente en la persona ni exclusivamente en el entorno, sino en la interacción dinámica entre ambos.",
      "Los Estudios Críticos en Discapacidad advierten además que muchas formas de exclusión no son inmediatamente visibles. Operan a través de instituciones, normativas, formas de organización social, decisiones políticas, prácticas profesionales y criterios de normalidad que suelen presentarse como neutrales o incluso inclusivos. Esta mirada cuestiona la llamada ideología de la normalidad, es decir, aquellas creencias y prácticas que determinan qué formas de aprender, comunicarse, participar o desenvolverse son consideradas “normales” y cuáles deben adaptarse para ser aceptadas.",
      "La pregunta ya no es solamente: ¿Qué barreras existen? También debemos preguntarnos: ¿Cómo se producen esas barreras? ¿Quiénes las sostienen? ¿Por qué continúan reproduciéndose incluso cuando las leyes reconocen derechos? Desde este enfoque, la inclusión deja de entenderse como la adaptación de algunas personas a sistemas ya establecidos y pasa a convertirse en un desafío colectivo: transformar instituciones, prácticas, culturas y políticas para garantizar el pleno ejercicio de los derechos humanos.",
      "En este sentido, la Convención de 2006 constituye una herramienta fundamental, pero las perspectivas críticas advierten que el reconocimiento jurídico no transforma automáticamente la realidad. Entre los discursos inclusivos, las leyes y las experiencias concretas de las personas continúan existiendo estructuras sociales, económicas, culturales y políticas que muchas veces ralentizan, limitan o contradicen los procesos de inclusión. Por ello, el debate deja de ser exclusivamente educativo o técnico para convertirse también en una cuestión de ciudadanía, justicia social y transformación democrática.",
    ],
    conceptos: [
      "Condición y situación de discapacidad",
      "Ideología de la normalidad",
      "Ciudadanía",
      "Justicia social",
    ],
    Icon: ShieldCheck,
    color: "secondary",
  },
];

const colorStyles = {
  // Colores compartidos por las tarjetas 01–04: ícono, número circular y borde superior.
  primary: {
    icon: "bg-primary-100 text-secondary-600 dark:bg-primary-900/30 dark:text-secondary-400",
    marker:
      "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300",
    accent: "border-primary-400",
  },
  secondary: {
    icon: "bg-primary-100 text-secondary-600 dark:bg-primary-900/30 dark:text-secondary-400",
    marker:
      "border-secondary-200 bg-secondary-50 text-secondary-700 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-300",
    accent: "border-secondary-400",
  },
} as const;

function ParadigmaModal({ paradigma, onClose }: { paradigma: Paradigma; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Paradigma {paradigma.numero}
              </p>
              <h2
                id="paradigma-modal-title"
                className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100"
              >
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
              <p
                key={parrafo}
                className="text-sm text-justify leading-7 text-gray-600 dark:text-gray-300"
              >
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
    <section
      aria-labelledby="paradigmas-title"
      className="overflow-hidden bg-white py-20 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-primary-600 dark:text-primary-400">
              <Scale className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                Una mirada histórica
              </span>
            </div>
            <Reveal>
              <h2
                id="paradigmas-title"
                className="text-3xl text-left font-bold leading-tight text-gray-900 sm:text-4xl dark:text-gray-100"
              >
                ¿Sabías que la manera de comprender la discapacidad ha cambiado a lo largo de la
                historia y sigue transformando la Educación Especial?
              </h2>
            </Reveal>
            <p className="mt-5 text-base text-justify leading-8 text-gray-600 dark:text-gray-300">
              La historia de la discapacidad no es lineal ni está cerrada. Cada época construyó
              distintas explicaciones sobre la diferencia, la participación y los derechos de las
              personas con discapacidad. Estos cambios dieron lugar a diversos paradigmas que
              transformaron las prácticas educativas y continúan interpelando nuestra tarea
              profesional en la actualidad.
            </p>
          </div>

          <aside className="border-l-4 border-secondary-400 bg-secondary-50 p-5 dark:bg-secondary-950/40">
            <p className="text-sm text-justify leading-7 text-secondary-900 dark:text-secondary-100">
              Tal como plantea Agustina Palacios, es posible reconocer distintos modelos o
              paradigmas que surgieron en contextos históricos específicos y que reflejan las
              formas en que las sociedades comprendieron la discapacidad a lo largo del tiempo. Si
              bien estos modelos no se suceden de manera absoluta ni desaparecen por completo,
              permiten comprender una evolución histórica que va desde la exclusión y la
              segregación hacia enfoques centrados en los derechos humanos, la participación y la
              inclusión.
            </p>
          </aside>
        </div>

        <div className="relative mt-16">
          <div
            className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-primary-200 via-secondary-300 to-primary-200 dark:from-primary-800 dark:via-secondary-700 dark:to-primary-800 lg:bottom-auto lg:left-[12.5%] lg:right-[12.5%] lg:top-7 lg:h-px lg:w-auto lg:bg-gradient-to-r"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 md:gap-6 lg:grid-cols-4">
            {paradigmas.map((paradigma) => {
              const Icon = paradigma.Icon;
              const styles = colorStyles[paradigma.color as keyof typeof colorStyles];

              // Contenedor y posición de cada tarjeta (01–04).
              return (
                <article key={paradigma.numero} className="relative pl-14 lg:pl-0 lg:pt-14">
                  {/* Número circular sobre la tarjeta: posición, tamaño, borde y color. */}
                  <div
                    className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm lg:left-1/2 lg:-translate-x-1/2 dark:border-gray-900 ${styles.marker}`}
                  >
                    <span className="text-xs font-bold">{paradigma.numero}</span>
                  </div>
                  {/* Estilos compartidos de la tarjeta: fondo, borde, sombra, hover y modo oscuro. */}
                  <div
                    className={`h-full rounded-2xl border border-gray-300 border-t-4 bg-gray-50 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60 ${styles.accent}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      {/* Número grande decorativo dentro de cada tarjeta. */}
                      <span className="text-4xl font-black text-gray-100 dark:text-gray-700">
                        {paradigma.numero}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">
                      {paradigma.titulo}
                    </h3>
                    <p className="mt-3 text-sm text-justify leading-7 text-gray-600 dark:text-gray-300">
                      {paradigma.resumen}
                    </p>
                    <button
                      type="button"
                      onClick={() => setParadigmaAbierto(paradigma)}
                      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200 dark:focus:ring-offset-gray-900"
                    >
                      Conocer este modelo
                      <ChevronRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-secondary-500 bg-primary-50 p-6 sm:p-8 dark:border-primary-800 dark:bg-primary-950/40">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <HeartHandshake className="h-7 w-7" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  Nuestra mirada
                </span>
              </div>
              <Reveal>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                  La mirada que sostiene nuestro Colegio
                </h2>
              </Reveal>
              <p className="mt-4 text-sm text-justify leading-7 text-gray-600 dark:text-gray-300">
                Desde el Colegio de Profesionales de la Educación Especial de Misiones entendemos
                que la discapacidad es una construcción compleja que involucra tanto la condición
                de cada persona como la situación en la que desarrolla su proyecto de vida.
                Reconocemos los aportes históricos del modelo social para identificar las barreras
                que limitan la participación, pero asumimos además una perspectiva crítica y de
                derechos humanos que nos invita a revisar las prácticas, las instituciones, las
                políticas y las concepciones de normalidad que aún generan exclusión.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  Icon: Users,
                  titulo: "Condición y situación de discapacidad",
                  texto:
                    "La discapacidad no se encuentra exclusivamente en la persona ni exclusivamente en el entorno, sino en la interacción dinámica entre ambos.",
                },
                {
                  Icon: Ban,
                  titulo: "Eliminación de barreras",
                  texto:
                    "Promovemos la eliminación de barreras para el aprendizaje y la participación, y la construcción de apoyos significativos.",
                },
                {
                  Icon: Scale,
                  titulo: "Transformar las estructuras",
                  texto:
                    "Un nuevo desafío: transformar las estructuras, no solo eliminar barreras. La inclusión como desafío colectivo y de justicia social.",
                },
              ].map(({ Icon, titulo, texto }) => (
                <article
                  key={titulo}
                  className="rounded-xl border border-secondary-500 bg-primary-200/10 p-5 shadow-sm dark:border-primary-900 dark:bg-gray-900/70"
                >
                  <Icon
                    className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                    {titulo}
                  </h3>
                  <p className="mt-2 text-sm text-justify leading-6 text-gray-600 dark:text-gray-300">
                    {texto}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <blockquote className="mt-8 flex gap-4 border-t border-primary-200 pt-6 dark:border-primary-800">
            <Quote
              className="mt-1 h-7 w-7 flex-shrink-0 text-secondary-600 dark:text-secondary-400"
              aria-hidden="true"
            />
            <p className="text-base font-medium leading-8 text-primary-900 dark:text-primary-100">
              Entendemos la inclusión no como la adaptación de las personas a estructuras rígidas,
              sino como la transformación de los entornos para que la diversidad humana sea
              reconocida, valorada y respetada. Porque la inclusión no es un favor ni una
              concesión:{" "}
              <strong>
                es un derecho humano y una responsabilidad colectiva
              </strong>{" "}
              y debe hacernos pensar en una perspectiva de accesibilidad.
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