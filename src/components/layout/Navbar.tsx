import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Leaf, Sun } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavChild {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  to?: string;
  children?: NavChild[];
}

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Trámites', to: '/tramites' },
  {
    label: 'Matriculados',
    children: [
      { label: 'Pagar Matrícula', to: '/matriculados/pago' },
      { label: 'Honorarios', to: '/matriculados/honorarios' },
      { label: 'Profesionales', to: '/matriculados/listado' },
    ],
  },
  { label: 'Obras Sociales', to: '/obras-sociales' },
  { label: 'Boletín Oficial', to: '/boletin-oficial' },
];

// ---------------------------------------------------------------------------
// Theme helpers
// ---------------------------------------------------------------------------

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

// ---------------------------------------------------------------------------
// Dropdown component
// ---------------------------------------------------------------------------

interface DropdownProps {
  item: NavItem & { children: NavChild[] };
}

function Dropdown({ item }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActiveParent = item.children.some((c) => location.pathname.startsWith(c.to));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={[
          'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActiveParent
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400',
        ].join(' ')}
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              role="menuitem"
              className={({ isActive }) =>
                [
                  'block px-4 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50',
                ].join(' ')
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-surface-dark/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary-600 dark:text-primary-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-xs font-black text-white">
                <img className='h-full w-full object-cover' src="/public/logo.jpg" alt="LOGO" />
              </span>
            </div>
            <span className="hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <Dropdown key={item.label} item={item as NavItem & { children: NavChild[] }} />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle — "Modo sustentable" */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo sustentable'}
              title={isDark ? 'Modo claro' : 'Modo sustentable'}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Leaf className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t border-gray-200 bg-white py-2 dark:border-gray-700 dark:bg-gray-900 lg:hidden"
          role="navigation"
          aria-label="Menú móvil"
        >
          <div className="mx-auto max-w-7xl space-y-0.5 px-4 pb-2">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                const isExpanded = mobileExpanded === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-primary-200 pl-3 dark:border-primary-800">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              [
                                'block rounded-md px-3 py-2 text-sm transition-colors',
                                isActive
                                  ? 'text-primary-600 font-medium dark:text-primary-400'
                                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-400',
                              ].join(' ')
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
