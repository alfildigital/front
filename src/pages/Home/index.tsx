import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, MailIcon } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
// import { InstagramCarousel } from '@/components/sections/InstagramCarousel';
import { NoticiasPreview } from '@/components/sections/NoticiasPreview';
import { ParadigmasEducacionEspecial } from '@/components/sections/ParadigmasEducacionEspecial';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Reveal } from '@/components/common/Reveal';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { useNoticias } from '@/hooks/queries/useNoticias';
// import { useInstagram } from '@/hooks/queries/useInstagram';
import { Building2, Eye, FileText, Target } from 'lucide-react'; // Eliminado Users si ya no se usa aquí
import { DocumentLink } from '@/components/common/DocumentLink';
import { InstagramBtn } from '@/components/common/InstagramBtn';
// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
   <section
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-20 text-white"
      aria-label="Presentación institucional"
    >
      <img
        src="imagenes/logo2.webp"
        alt="Logo de fondo del sitio web del Colegio de Profesionales en Educación Especial"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-10"
      />
  {/* Decorative circles */}
  <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
  <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="w-full">
        <Reveal className="max-w-2xl">
            <h1 className="flex flex-wrap items-center gap-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              <span className="text-secondary-200">{SITE_NAME}</span>
                <span className="inline-flex items-center rounded-xl border border-white/40 px-3 py-1.5 text-sm font-semibold text-white">
                N° PPJJ A-5458
              </span>
            </h1>
          <p className="mt-4 text-lg text-white/85">
            Servicio y representación para los profesionales. Trámites, información
            institucional y más, en un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">

            <Link
              to="/tramites"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md"
            >
              Ver Trámites
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Últimas Noticias
            </Link>
          </div>
            <DocumentLink href="https://digestomisiones.gob.ar/archivospdf/1702476679_Ley%20I%20-%20N%C2%B0%20177.pdf" icon={FileText}>
                Ley de creación del Colegio (Ley I - N.º 177)
            </DocumentLink>
        </Reveal>

        {/* Quick info */}
        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <a
            href="mailto:colegioedeespeciales@gmail.com"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <MailIcon className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Escribinos</span>
          </a>
          <a
            href="https://wa.me/543764130888?text=Hola%2C%20quiero%20consultar%20sobre%20las%20actividades%20del%20colegio."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <Phone className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Consultas: (376) 413-0888</span>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=calle+63+8205+san+onofre,+Posadas,+Misiones,+Argentina"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <MapPin className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Direccion Formal - Calle 63 N° 8205 B° San Onofre - Posadas, Misiones</span>
          </a>
        </div>
    </div>
  </div>
</section>
  );
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const noticias = useNoticias();
  // const instagram = useInstagram();

  return (
    <Layout>
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta
          name="description"
          content="Sitio oficial del colegio profesional. Información institucional, trámites, noticias y más."
        />
      </Helmet>
      <Hero />
      <ParadigmasEducacionEspecial />

      {/* Noticias */}
      {noticias.isPending && (
        <div className="py-16 bg-gray-50 dark:bg-gray-800/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CardSkeletonGrid count={3} />
          </div>
        </div>
      )}
      {noticias.isError && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBanner message="No se pudieron cargar las noticias." onRetry={() => void noticias.refetch()} />
          </div>
        </div>
      )}

      <section aria-labelledby="institution-title" className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-8">
            <div className="w-full lg:w-[80%]">
              <div className="max-w-3xl text-center lg:text-left">
                <div className="mb-5 flex items-center justify-center gap-3 text-primary-600 dark:text-primary-400 lg:justify-start">
                  <Building2 className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Institución</span>
                </div>
                <Reveal>
                  <h1 id="institution-title" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    El Colegio
                  </h1>
                </Reveal>
                <p className="mt-4 text-justify text-sm leading-8 text-gray-600 dark:text-gray-300">
                  El Colegio de Profesionales en Educación Especial es la institución rectora que agrupa y representa a los profesionales dedicados a la atención, enseñanza y acompañamiento de personas con discapacidad. Somos una comunidad comprometida con la ética profesional, la actualización constante y la defensa de los derechos humanos.
                  <br /><br />
                  Nuestra labor trasciende el aula: trabajamos para garantizar que la educación especial sea un pilar fundamental en la construcción de una sociedad más justa e inclusiva. Agrupamos a expertos en diversas áreas, fomentando el intercambio de experiencias y el desarrollo técnico-científico para brindar respuestas innovadoras a los desafíos educativos actuales.
                </p>


                {/*-------------------------- componente IG ------------------------------*/}        
                  <InstagramBtn />

              </div>
            </div>
            <div className="flex w-full items-center justify-center lg:w-[20%] lg:justify-end">
              <div className="flex aspect-video bg-primary-50 p-2  shadow-lg dark:bg-gray-800">
                <img src="/imagenes/new_logo.webp" alt={`Logo de ${SITE_NAME}`} className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Visión y misión -----------------------------------*/}

      <section aria-labelledby="vision-mission-title" className="bg-gray-50 py-16 dark:bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Reveal>
              <h2 id="vision-mission-title" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Visión y misión
              </h2>
            </Reveal>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Construimos una institución moderna, transparente y al servicio de sus profesionales.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="border border-gray-300 border-l-4 border-l-primary-500 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:border-l-primary-500 dark:bg-gray-900">
              <Target className="h-7 w-7 text-primary-500 dark:text-primary-500" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Misión</h3>
              <p className="mt-3 text-justify text-base leading-7 text-gray-600 dark:text-gray-300">
               Defender los derechos de los profesionales en el ámbito de la Educación Especial, promoviendo su desarrollo y formación continua; como asi también, velar por el cumplimiento de las obligaciones profesionales y establecer estánderes éticos elevados para garantizar un servicio de calidad.
              </p>
            </article>
            <article className="border border-gray-300 border-l-4 border-l-secondary-500 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:border-l-secondary-500 dark:bg-gray-900">
              <Eye className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Visión</h3>
              <p className="mt-3 text-justify text-base leading-7 text-gray-600 dark:text-gray-300">
                El CPEE aspira a ser una entidad de referencia en el ámbito de la educacion inclusiva, que contribuya significativamente al desarrollo de una sociedad mas humana y respetuosa de la diversidad.
              </p>
            </article>
          </div>
        </div>
      </section>

      {!noticias.isPending && !noticias.isError && noticias.data?.length === 0 && (
        <section aria-label="Noticias" className="py-16 bg-gray-50 dark:bg-gray-800/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <EmptyState
              title="No hay noticias para mostrar"
              description="Todavía no se publicaron novedades para esta sección."
            />
          </div>
        </section>
      )}
      {noticias.data && noticias.data.length > 0 && (
        <NoticiasPreview noticias={noticias.data.slice(0, 3)} />
      )}

      {/* Instagram — se oculta si no hay posts, sin EmptyState */}
      {/* {instagram.data && instagram.data.length > 0 && (
        <InstagramCarousel posts={instagram.data} />
      )} */}
    </Layout>
  );
}