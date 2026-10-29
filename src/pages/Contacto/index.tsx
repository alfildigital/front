import { Helmet } from 'react-helmet-async';
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { Reveal } from '@/components/common/Reveal';
import { SITE_NAME } from '@/config/constants';

type ContactCardProps = {
  icon: LucideIcon;
  title: string;
  href: string;
  label: string;
  external?: boolean;
  isPrimary?: boolean;
};

function ContactCard({
  icon: Icon,
  title,
  href,
  label,
  external = false,
  isPrimary = false,
}: ContactCardProps) {
  return (

    <article className="group relative flex h-full min-w-0 flex-col items-center overflow-hidden rounded-2xl border border-secondary-200 bg-white p-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-primary-500 dark:hover:bg-gray-800">

      {/* Decoración institucional */}
      <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-secondary-200/70 transition-transform duration-500 group-hover:scale-150 dark:bg-primary-900/20" />

      {/* Icono circular */}
      <div className="relative mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-secondary-300 bg-primary-300/50 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-primary-500 group-hover:shadow-lg">
        <Icon className="h-7 w-7 text-gray-600/70 dark:text-gray-400" aria-hidden="true" />
      </div>

      {/* Título y enlace */}
      <div className="relative flex w-full min-w-0 flex-1 flex-col items-center">
        <h2 className="w-full break-words text-lg font-bold leading-tight text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={`mt-3 block w-full min-w-0 break-words [overflow-wrap:anywhere] text-sm leading-relaxed transition-colors ${
            isPrimary
              ? 'font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
              : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
          }`}
        >
          {label}
        </a>
      </div>

      {/* Indicador decorativo inferior */}
      <div className="mt-4 h-1 w-10 shrink-0 rounded-full bg-secondary-400 transition-all duration-300 group-hover:w-16 group-hover:bg-primary-500" />
    </article>
  );
}

type ContactActionProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
  external?: boolean;
};

function ContactAction({
  href,
  label,
  icon: Icon,
  primary = false,
  external = false,
}: ContactActionProps) {
  const classes = primary
    ? 'border-primary-500 bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg'
    : 'border-gray-300 bg-white text-gray-800 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`inline-flex min-w-0 max-w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${classes}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-words">{label}</span>
    </a>
  );
}

export default function ContactoPage() {
  const telefono = '+54 9 376 413-0888';
  const email = 'colegioedeespeciales@gmail.com';
  const direccion = 'Calle 63 N° 8205, B° San Onofre - Posadas, Misiones';

  const mapaUrl =
    'https://www.google.com/maps/search/?api=1&query=Calle+63+8205+San+Onofre+Posadas+Misiones+Argentina';

  const whatsappUrl =
    'https://wa.me/543764130888?text=Hola%2C%20quiero%20consultar%20sobre%20las%20actividades%20del%20colegio.';

  const contactCards = [
    {
      icon: Phone,
      title: 'Teléfono',
      href: 'tel:+543764130888',
      label: telefono,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      href: whatsappUrl,
      label: 'Consultas por WhatsApp',
      external: true,
      isPrimary: true,
    },
    {
      icon: Mail,
      title: 'Email',
      href: `mailto:${email}`,
      label: email,
    },
    {
      icon: MapPin,
      title: 'Dirección',
      href: mapaUrl,
      label: direccion,
      external: true,
    },
  ];

  const contactActions = [
    {
      href: 'tel:+543764130888',
      label: 'Llamar',
      icon: Phone,
      primary: true,
    },
    {
      href: whatsappUrl,
      label: 'WhatsApp',
      icon: MessageCircle,
      external: true,
    },
    {
      href: mapaUrl,
      label: 'Ver ubicación',
      icon: MapPin,
      external: true,
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>
          Contacto del Colegio de Educación Especial en Posadas | Teléfono y
          dirección
        </title>

        <meta
          name="description"
          content="Contacto institucional del Colegio de Profesionales en Educación Especial en Posadas, Misiones. Teléfono, dirección, email y consultas por WhatsApp."
        />

        <link
          rel="canonical"
          href="https://colegioedespecial.org.ar/contacto"
        />
      </Helmet>

      <main className="mx-auto bg-secondary-100/10 w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      
        {/* Encabezado */}
        <Reveal as="header" className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 shadow-sm dark:border-primary-800 dark:bg-primary-900/20">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              Estamos para ayudarte
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Contacto institucional
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Consultas, trámites y atención presencial del Colegio de
            Profesionales en Educación Especial.
          </p>
        </Reveal>

        {/* Tarjetas de contacto */}
        <section
          aria-label="Medios de contacto"
          className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactCards.map(
            ({ icon, title, href, label, external, isPrimary }) => (
              <ContactCard
                key={title}
                icon={icon}
                title={title}
                href={href}
                label={label}
                external={external}
                isPrimary={isPrimary}
              />
            ),
          )}
        </section>

        {/* Atención institucional */}
        <Reveal
          as="section"
          className="relative mt-10 overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 text-center shadow-sm dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 sm:p-8"
        >
          {/* Decoración de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary-200/70 transition-all duration-500 ease-out hover:scale-110 hover:bg-secondary-300/80 dark:bg-primary-900/20 dark:hover:bg-primary-800/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary-100/80 transition-all duration-500 ease-out hover:scale-105 hover:bg-primary-200/90 dark:bg-primary-900/10 dark:hover:bg-primary-800/20"
          />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-secondary-300 bg-primary-300/50 text-white shadow-md">
              <MapPin className="h-7 w-7 text-gray-600/70 dark:text-gray-400" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
              Atención institucional
            </h2>

            <p className="mx-auto mt-4 max-w-3xl break-words text-justify text-sm leading-7 text-gray-600 dark:text-gray-300">
              El {SITE_NAME} atiende consultas vinculadas a matrícula
              profesional, trámites institucionales, documentación y
              procedimientos vigentes. Para mayores consultas, podés
              comunicarte por teléfono, WhatsApp o enviar un mensaje al domicilio formal en Posadas, Misiones.
            </p>

            {/* Acciones de contacto */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {contactActions.map(
                ({ href, label, icon, primary, external }) => (
                  <ContactAction
                    key={label}
                    href={href}
                    label={label}
                    icon={icon}
                    primary={primary}
                    external={external}
                  />
                ),
              )}
            </div>
          </div>
        </Reveal>
      </main>
    </Layout>
  );
}