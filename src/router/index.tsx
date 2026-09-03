import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/common/Spinner';

// ---------------------------------------------------------------------------
// Lazy loading de páginas para reducir el bundle inicial
// ---------------------------------------------------------------------------

const HomePage         = lazy(() => import('@/pages/Home'));
const NoticiasPage     = lazy(() => import('@/pages/Noticias'));
const NoticiaDetalle   = lazy(() => import('@/pages/Noticias/NoticiaDetalle'));
const TramitesPage     = lazy(() => import('@/pages/Tramites'));
const PagoPage         = lazy(() => import('@/pages/Matriculados/Pago'));
const ListadoPage      = lazy(() => import('@/pages/Matriculados/Listado'));
const HonorariosPage   = lazy(() => import('@/pages/Matriculados/Honorarios'));
const InformacionPage  = lazy(() => import('@/pages/Matriculados/Informacion'));
const ObrasSociales    = lazy(() => import('@/pages/ObrasSociales'));
const ArancelesPage    = lazy(() => import('@/pages/ObrasSociales/Aranceles'));
const RequisitosPage   = lazy(() => import('@/pages/ObrasSociales/Requisitos'));
const AlquileresPage   = lazy(() => import('@/pages/Alquileres'));
const BoletinPage      = lazy(() => import('@/pages/BoletinOficial'));
const NotFoundPage     = lazy(() => import('@/pages/NotFound'));

// ---------------------------------------------------------------------------
// Suspense fallback
// ---------------------------------------------------------------------------

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" label="Cargando página..." />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(HomePage),
  },
  {
    path: '/noticias',
    element: withSuspense(NoticiasPage),
  },
  {
    path: '/noticias/:id',
    element: withSuspense(NoticiaDetalle),
  },
  {
    path: '/tramites',
    element: withSuspense(TramitesPage),
  },
  {
    path: '/matriculados/pago',
    element: withSuspense(PagoPage),
  },
  {
    path: '/matriculados/listado',
    element: withSuspense(ListadoPage),
  },
  {
    path: '/matriculados/honorarios',
    element: withSuspense(HonorariosPage),
  },
  {
    path: '/matriculados/informacion',
    element: withSuspense(InformacionPage),
  },
  {
    path: '/obras-sociales',
    element: withSuspense(ObrasSociales),
  },
  {
    path: '/obras-sociales/aranceles',
    element: withSuspense(ArancelesPage),
  },
  {
    path: '/obras-sociales/requisitos',
    element: withSuspense(RequisitosPage),
  },
  {
    path: '/alquileres',
    element: withSuspense(AlquileresPage),
  },
  {
    path: '/boletin-oficial',
    element: withSuspense(BoletinPage),
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);
