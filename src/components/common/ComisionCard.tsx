/*
import { Users } from 'lucide-react';

interface ComisionCardProps {
  name?: string; // Opcional, por si quieres mostrar el nombre además del rol
  role: string;
  image?: string;
  bgcolor: 'primary' | 'secondary';
  subtitle?: string; // Opcional por si quieres añadir "Suplente" o algo extra
}

export function ComisionCard({ name, role, image, bgcolor, subtitle }: ComisionCardProps) {
  // Definimos los colores basados en la prop bgcolor
  const bgColorClass = bgcolor === 'primary' 
    ? 'bg-primary-500' 
    : 'bg-secondary-500';
  
  // Color de acento para los detalles decorativos (como los trazos verdes de la imagen)
  const accentColorClass = bgcolor === 'primary' 
    ? 'bg-secondary-400' 
    : 'bg-primary-400';

  return (
    <article className={`relative flex w-full max-w-[360px] flex-col items-center overflow-hidden rounded-2xl p-6 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 ${bgColorClass}`}>
      
        //Detalles decorativos (simulando los trazos verdes de la imagen)

        <div className={`absolute top-9 left-14 h-8 w-2 rotate-[135deg] rounded-full ${accentColorClass} opacity-80`} />
        <div className={`absolute top-20 left-10 h-6 w-2 rotate-[125deg] rounded-full ${accentColorClass} opacity-80`} />
        <div className={`absolute top-6 left-20 h-2 w-6 rotate-[55deg] rounded-full ${accentColorClass} opacity-80`} />}

      // Logo (opcional, arriba a la derecha)
      <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-1">
        <img src="/logo.jpg" alt="Logo" className="h-full w-full object-contain" />
      </div>

      //Contenedor de la Imagen
      <div className="relative mb-4 mt-2 h-60 w-60 overflow-hidden rounded-full border-6 border-white bg-white shadow-inner">
        {image ? (
          <img
            src={`/comision_directiva/${image}`}
            alt={role}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <Users className="h-16 w-16" aria-hidden="true" />
          </div>
        )}
      </div>

      // Texto
      <div className="z-10 mt-2 flex flex-col gap-1">

         <h2 className="text-xl font-bold leading-tight text-white drop-shadow-md">
          {name}
        </h2>
        <h3 className="text-xl font-bold leading-tight text-white drop-shadow-md">
          {role}
        </h3>
        
        //Si hay subtítulo (ej: "Suplente"), lo mostramos con un estilo distinto
        {subtitle && (
          <span className="text-sm font-medium text-white/90 bg-black/20 px-2 py-0.5 rounded-full inline-block mx-auto">
            {subtitle}
          </span>
        )}
      </div>
    </article>
  );
}
*/

import { Users } from 'lucide-react';

interface ComisionCardProps {
  role: string;
  image?: string;
  bgcolor: 'primary' | 'secondary';
  subtitle?: string;
}

export function ComisionCard({ role, image, bgcolor, subtitle }: ComisionCardProps) {
  const bgColorClass = bgcolor === 'primary' 
    ? 'bg-primary-500' 
    : 'bg-secondary-500';
  
  return (
    <article className={`relative flex w-full max-w-[360px] flex-col items-center overflow-hidden rounded-2xl p-6 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 ${bgColorClass}`}>
      
      {/* Contenedor de la Imagen*/}
      <div className="relative mb-4 mt-2 h-60 w-60 overflow-hidden rounded-xl bg-white shadow-md">
        {image ? (
          <img
            src={`/comision_directiva/${image}`}
            alt={role}
            loading="lazy"
            // Cambiamos object-top por object-center para que siempre centre la imagen
            // y object-cover asegura que llene el 100% del contenedor sin deformarse
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <Users className="h-16 w-16" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Texto - Solo Rol y Subtítulo */}
      <div className="z-10 mt-2 flex flex-col gap-1">
        <h3 className="text-xl font-bold leading-tight text-white drop-shadow-md">
          {role}
        </h3>
        
        {subtitle && (
          <span className="text-sm font-medium text-white/90 bg-black/20 px-2 py-0.5 rounded-full inline-block mx-auto">
            {subtitle}
          </span>
        )}
      </div>
    </article>
  );
}