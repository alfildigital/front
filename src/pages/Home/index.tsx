import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { InstagramCarousel } from '@/components/sections/InstagramCarousel';
import { NoticiasPreview } from '@/components/sections/NoticiasPreview';
import { TramitesDestacados } from '@/components/sections/TramitesDestacados';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { useNoticias } from '@/hooks/queries/useNoticias';
import { useTramites } from '@/hooks/queries/useTramites';
import { useInstagram } from '@/hooks/queries/useInstagram';

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-20 text-white"
      aria-label="Presentación institucional"
    >
      {/* Decorative circles */}
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Bienvenidos al
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
        </div>

        {/* Quick info */}
        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Phone className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Consultas: (0351) 000-0000</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Sede Central — Av. Ejemplo 1234</span>
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
  const tramites = useTramites();
  const instagram = useInstagram();

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

      {/* Trámites */}
      {tramites.isPending && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CardSkeletonGrid count={4} />
          </div>
        </div>
      )}
      {tramites.isError && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBanner message="No se pudieron cargar los trámites." onRetry={() => void tramites.refetch()} />
          </div>
        </div>
      )}
      {tramites.data && tramites.data.length > 0 && (
        <TramitesDestacados tramites={tramites.data} />
      )}

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
      {noticias.data && noticias.data.length > 0 && (
        <NoticiasPreview noticias={noticias.data.slice(0, 3)} />
      )}

      {/* Instagram — se oculta si no hay posts, sin EmptyState */}
      {instagram.data && instagram.data.length > 0 && (
        <InstagramCarousel posts={instagram.data} />
      )}
    </Layout>
  );
}
