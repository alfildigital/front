/*import { Helmet } from 'react-helmet-async';
import { Building2, Eye, Instagram, Target, Users } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { Reveal } from '@/components/common/Reveal';

interface Member {
  role: string;
  image?: string;
}

const boardGroups: Member[][] = [
  [
    { role: 'Presidenta', image: 'presidenta.jpeg' },
    { role: 'Vicepresidenta', image: 'vicepresidenta.jpeg' },
  ],
  [
    { role: 'Secretaria', image: 'secretaria.jpeg' },
    { role: 'Tesorera', image: 'tesorera.jpeg' },
    { role: 'Primera consejera', image: 'primer_consejera.jpeg' },
  ],
  [
    { role: 'Segunda consejera', image: 'segunda_consejera.jpeg' },
    { role: 'Integrante suplente', image: 'consejo_directivo_suplente.jpeg' },
    { role: 'Integrante' },
  ],
];

const auditGroups: Member[][] = [
  [
    { role: 'Titular', image: 'revision_cuenta_titular.jpeg' },
    { role: 'Segundo titular', image: 'revision_cuenta_segundo_titular.jpeg' },
  ],
  [
    { role: 'Suplente', image: 'revision_cuenta_suplente.jpeg' },
    { role: 'Suplente', image: 'revision_cuenta_suplente_2.jpeg' },
  ],
];

const ethicsGroups: Member[][] = [
  [
    { role: 'Presidente', image: 'etica_disciplina_presidente.jpeg' },
    { role: 'Vicepresidente', image: 'etica_disciplina_vice_presidente.jpeg' },
    { role: 'Secretaria', image: 'etica_disciplina_secretaria.jpeg' },
  ],
  [
    { role: 'Titular', image: 'etica_disciplina_titular.jpeg' },
    { role: 'Titular', image: 'etica_disciplina_titular_2.jpeg' },
  ],
];

function InstitutionSections() {
  return (
    <>
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
                    Nosotros
                  </h1>
                </Reveal>
                <p className="mt-4 text-justify text-sm leading-8 text-gray-600 dark:text-gray-300">
                  El Colegio de Profesionales en Educación Especial es la institución rectora que agrupa y representa a los profesionales dedicados a la atención, enseñanza y acompañamiento de personas con discapacidad. Somos una comunidad comprometida con la ética profesional, la actualización constante y la defensa de los derechos humanos.
                  <br /><br />
                  Nuestra labor trasciende el aula: trabajamos para garantizar que la educación especial sea un pilar fundamental en la construcción de una sociedad más justa e inclusiva. Agrupamos a expertos en diversas áreas, fomentando el intercambio de experiencias y el desarrollo técnico-científico para brindar respuestas innovadoras a los desafíos educativos actuales.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <a
                    href="https://www.instagram.com/colegioedespecial.msn?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-primary-600 transition-colors hover:border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-medium">Seguinos en Instagram</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center lg:w-[20%] lg:justify-end">
              <div className="flex aspect-square bg-primary-50 p-4 shadow-lg dark:bg-gray-800">
                <img src="/logo.jpg" alt={`Logo de ${SITE_NAME}`} className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <Target className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Misión</h3>
              <p className="mt-3 text-justify text-sm leading-7 text-gray-600 dark:text-gray-300">
                Regular, promover y jerarquizar el ejercicio profesional de la Educación Especial, velando por la idoneidad, ética y formación continua de nuestros matriculados. Buscamos garantizar una educación de calidad que potencie las capacidades de cada estudiante, promoviendo su autonomía e inclusión plena en el ámbito social, educativo y laboral.
              </p>
            </article>
            <article className="border border-gray-300 border-l-4 border-l-secondary-500 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:border-l-secondary-500 dark:bg-gray-900">
              <Eye className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Visión</h3>
              <p className="mt-3 text-justify text-sm leading-7 text-gray-600 dark:text-gray-300">
                Ser la institución referente a nivel nacional en materia de Educación Especial, reconocida por su excelencia técnica y su capacidad de incidencia en las políticas públicas. Aspiramos a construir una sociedad donde la diversidad sea valorada y donde cada persona con discapacidad tenga garantizado su derecho a aprender y desarrollarse plenamente, de la mano de profesionales altamente calificados.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

function MemberGroup({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {members.map((member, index) => (
        <article
          key={`${member.role}-${member.image ?? index}`}
          className="w-full max-w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-700"
        >
          {member.image ? (
            <img
              src={`/comision_directiva/${member.image}`}
              alt={member.role}
              loading="lazy"
              className="aspect-square w-full object-cover object-top transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              <Users className="h-9 w-9" aria-hidden="true" />
            </div>
          )}
          <p className="px-2 py-2.5 text-center text-xs font-semibold text-gray-800 dark:text-gray-100 sm:text-sm">
            {member.role}
          </p>
        </article>
      ))}
    </div>
  );
}

function CommitteeSection({ groups, title, sectionIndex }: { groups: Member[][]; title: string; sectionIndex: number }) {
  const sectionTint = sectionIndex % 2 === 0
    ? 'bg-primary-500/[0.025] dark:bg-primary-400/[0.04]'
    : 'bg-secondary-500/[0.025] dark:bg-secondary-400/[0.04]';

  return (
    <section className="border-t border-secondary-600 bg-gray-100 py-14 dark:border-secondary-700 dark:bg-gray-900" aria-label={title}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`space-y-8 rounded-lg px-4 py-8 sm:px-8 ${sectionTint}`}>
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </Reveal>
          {groups.map((members, index) => (
            <div
              key={`${title}-${index}`}
              className={`rounded-md p-4 sm:p-6 ${index > 0 ? 'border-t border-secondary-600 pt-8 dark:border-green-500' : ''} ${
                (sectionIndex + index) % 2 === 0
                  ? 'bg-primary-500/[0.06] dark:bg-primary-400/[0.08]'
                  : 'bg-secondary-500/[0.07] dark:bg-secondary-400/[0.08]'
              }`}
            >
              <MemberGroup members={members} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NosotrosPage() {
  return (
    <Layout>
      <Helmet>
        <title>Nosotros | {SITE_NAME}</title>
        <meta name="description" content="Conocé la institución, su misión, visión y órganos directivos." />
      </Helmet>
      <InstitutionSections />
      <CommitteeSection groups={boardGroups} title="Consejo Directivo" sectionIndex={0} />
      <CommitteeSection groups={auditGroups} title="Comisión Revisora de Cuentas" sectionIndex={1} />
      <CommitteeSection groups={ethicsGroups} title="Tribunal de Ética y Disciplina" sectionIndex={2} />
    </Layout>
  );
}*/


{/*================================================================================== */}
{/*===================V2 con comision cards========================================== */}
{/*================================================================================== */}


import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { Reveal } from '@/components/common/Reveal';
import { ComisionCard } from '@/components/common/ComisionCard'; // <--- Importamos el nuevo componente

// Actualizamos la interfaz para incluir los nuevos campos
interface Member {
  name?: string; // Si quieres agregar nombres además de roles
  role: string;
  image?: string;
  subtitle?: string; // Para "Suplente", "Titular", etc.
  bgcolor?: 'primary' | 'secondary'; // Para alternar colores
}

const boardGroups: Member[][] = [
  [
    { name: 'María González', role: 'Presidenta', image: 'presidenta.jpeg', bgcolor: 'primary' },
    { name: 'Ana Martínez', role: 'Vicepresidenta', image: 'vicepresidenta.jpeg', bgcolor: 'secondary' },
  ],
  [
    { name: 'Laura Rodríguez', role: 'Secretaria', image: 'secretaria.jpeg', bgcolor: 'primary' },
    { name: 'Sofía López', role: 'Tesorera', image: 'tesorera.jpeg', bgcolor: 'secondary' },
    { name: 'Carlos Ruiz', role: 'Primera consejera', image: 'primer_consejera.jpeg', bgcolor: 'primary' },
  ],
  [
    { name: 'Marta Hernández', role: 'Segunda consejera', image: 'segunda_consejera.jpeg', bgcolor: 'secondary' },
    { name: 'Javier Díaz', role: 'Integrante suplente', image: 'consejo_directivo_suplente.jpeg', bgcolor: 'primary' },
    { name: 'Elena García', role: 'Integrante', image: 'presidenta_suplente.jpeg', bgcolor: 'secondary' },
  ],
];

const auditGroups: Member[][] = [
  [
    { name: 'María González', role: 'Revisora de Cuentas', subtitle: 'Titular', image: 'revision_cuenta_titular.jpeg', bgcolor: 'primary' },
    { name: 'Ana Martínez', role: 'Revisor de Cuentas', subtitle: 'Segundo Titular', image: 'revision_cuenta_segundo_titular.jpeg', bgcolor: 'secondary' },
  ],
  [
    { name: 'Laura Rodríguez', role: 'Revisora de Cuentas', subtitle: 'Suplente', image: 'revision_cuenta_suplente.jpeg', bgcolor: 'primary' },
    { name: 'Sofía López', role: 'Revisor de Cuentas', subtitle: 'Suplente', image: 'revision_cuenta_suplente_2.jpeg', bgcolor: 'secondary' },
  ],
];

const ethicsGroups: Member[][] = [
  [
    { name: 'María González', role: 'Presidente', image: 'etica_disciplina_presidente.jpeg', bgcolor: 'primary' },
    { name: 'Ana Martínez', role: 'Vicepresidente', image: 'etica_disciplina_vice_presidente.jpeg', bgcolor: 'secondary' },
    { name: 'Laura Rodríguez', role: 'Secretaria', image: 'etica_disciplina_secretaria.jpeg', bgcolor: 'primary' },
  ],
  [
    { name: 'Marta Hernández', role: 'Titular', image: 'etica_disciplina_titular.jpeg', bgcolor: 'secondary' },
    { name: 'Javier Díaz', role: 'Titular', image: 'etica_disciplina_titular_2.jpeg', bgcolor: 'primary' },
  ],
];

// Modificamos MemberGroup para usar ComisionCard
function MemberGroup({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {members.map((member, index) => (
        <ComisionCard
          key={`${member.role}-${member.image ?? index}`}
          name={member.name}
          role={member.role}
          image={member.image}
          subtitle={member.subtitle}
          bgcolor={member.bgcolor || (index % 2 === 0 ? 'primary' : 'secondary')} // Fallback por si no se define
        />
      ))}
    </div>
  );
}

function CommitteeSection({ groups, title, sectionIndex }: { groups: Member[][]; title: string; sectionIndex: number }) {
  const sectionTint = sectionIndex % 2 === 0
    ? 'bg-primary-500/[0.025] dark:bg-primary-400/[0.04]'
    : 'bg-secondary-500/[0.025] dark:bg-secondary-400/[0.04]';

  return (
    <section className="border-t border-secondary-600 bg-gray-100 py-14 dark:border-secondary-700 dark:bg-gray-900" aria-label={title}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`space-y-8 rounded-lg px-4 py-8 sm:px-8 ${sectionTint}`}>
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </Reveal>
          {groups.map((members, index) => (
            <div
              key={`${title}-${index}`}
              className={`rounded-md p-4 sm:p-6 ${index > 0 ? 'border-t border-secondary-600 pt-8 dark:border-green-500' : ''} ${
                (sectionIndex + index) % 2 === 0
                  ? 'bg-primary-500/[0.06] dark:bg-primary-400/[0.08]'
                  : 'bg-secondary-500/[0.07] dark:bg-secondary-400/[0.08]'
              }`}
            >
              <MemberGroup members={members} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NosotrosPage() {
  return (
    <Layout>
      <Helmet>
        <title>Nosotros | {SITE_NAME}</title>
        <meta name="description" content="Conocé la institución, su misión, visión y órganos directivos." />
      </Helmet>
      <CommitteeSection groups={boardGroups} title="Consejo Directivo" sectionIndex={0} />
      <CommitteeSection groups={auditGroups} title="Comisión Revisora de Cuentas" sectionIndex={1} />
      <CommitteeSection groups={ethicsGroups} title="Tribunal de Ética y Disciplina" sectionIndex={2} />
    </Layout>
  );
}