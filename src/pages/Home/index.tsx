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
        src="/inclusionsiluet.png"
        alt=""
        aria-hidden="true"
        className="absolute bg-black/20 inset-0 h-full w-full object-cover opacity-50"
      />
  {/* Decorative circles */}
  <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
  <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="w-full">
        <Reveal className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            <br />
            <span className="text-secondary-200">{SITE_NAME}</span>
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Servicio y representación para los profesionales. Trámites, información
            institucional y más, en un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
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
            href="https://wa.me/543764154343?text=Hola%2C%20quiero%20consultar%20sobre%20las%20actividades%20del%20colegio."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <Phone className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Consultas: (376) 415-4343</span>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+mitre+1234,+Posadas,+Misiones,+Argentina"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <MapPin className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Sede Central — Av. Mitre 1234</span>
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
