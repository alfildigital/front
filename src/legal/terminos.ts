/**
 * Términos y Condiciones del sitio institucional.
 *
 * VERSIONADO:
 *   - Incrementar `version` cada vez que el contenido cambie sustancialmente.
 *   - Registrar el cambio en el historial al pie de este archivo.
 *   - El backend almacena la versión aceptada junto con el consentimiento del usuario.
 *
 * PLACEHOLDERS:
 *   Los valores entre corchetes deben ser completados con los datos reales de la institución
 *   antes de publicar en producción:
 *     [NOMBRE DEL COLEGIO]  →  nombre legal completo
 *     [PROVINCIA]           →  provincia de la institución
 *     [CUIT]                →  número de CUIT
 *     [DOMICILIO LEGAL]     →  dirección legal completa
 *     [EMAIL DE CONTACTO]   →  email institucional
 *     [TELÉFONO]            →  teléfono de contacto
 *     [CIUDAD]              →  ciudad sede de la institución
 *
 * HISTORIAL DE VERSIONES:
 *   v1.0 (2025-01-01) — Versión inicial.
 */

export interface LegalSection {
  id: string;
  titulo: string;
  parrafos: string[];
}

export interface LegalDocument {
  version: string;
  fechaVigencia: string;
  titulo: string;
  subtitulo: string;
  secciones: LegalSection[];
}

export const terminosYCondiciones: LegalDocument = {
  version: '1.0',
  fechaVigencia: '2025-01-01',
  titulo: 'Términos y Condiciones',
  subtitulo:
    'Al utilizar este sitio web, el usuario acepta los presentes Términos y Condiciones. Le solicitamos que los lea detenidamente antes de continuar.',

  secciones: [
    {
      id: 'titular',
      titulo: '1. Identificación del titular del sitio',
      parrafos: [
        'El presente sitio web es operado por [NOMBRE DEL COLEGIO] (en adelante, "la Institución"), con domicilio legal en [DOMICILIO LEGAL], [CIUDAD], [PROVINCIA], Argentina, CUIT [CUIT].',
        'Para comunicaciones relacionadas con el uso de este sitio, puede contactarnos a través de [EMAIL DE CONTACTO] o al teléfono [TELÉFONO].',
      ],
    },
    {
      id: 'aceptacion',
      titulo: '2. Aceptación de los términos',
      parrafos: [
        'El acceso y uso de este sitio web implica la aceptación plena y sin reservas de los presentes Términos y Condiciones, así como de la Política de Privacidad vigente.',
        'La Institución se reserva el derecho de modificar los presentes términos en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio. Se recomienda revisar periódicamente este documento.',
        'Si el usuario no está de acuerdo con los presentes términos, deberá abstenerse de utilizar el sitio web.',
      ],
    },
    {
      id: 'uso-del-sitio',
      titulo: '3. Uso del sitio',
      parrafos: [
        'El usuario se compromete a utilizar este sitio web de forma lícita, honesta y de buena fe, respetando la legislación vigente en la República Argentina y los derechos de terceros.',
        'Queda prohibido utilizar el sitio para fines fraudulentos, enviar comunicaciones masivas no solicitadas, intentar acceder de manera no autorizada a sistemas o datos, o publicar contenido ilícito o lesivo.',
        'La Institución se reserva el derecho de denegar el acceso al sitio o a determinados servicios a cualquier usuario que incumpla los presentes términos.',
      ],
    },
    {
      id: 'formularios',
      titulo: '4. Formularios y solicitudes',
      parrafos: [
        'El sitio ofrece formularios de contacto para consultas sobre alquileres de espacios y solicitudes de incorporación al convenio de obras sociales.',
        'Al completar y enviar un formulario, el usuario declara que los datos proporcionados son verídicos, actualizados y completos, y que cuenta con legitimación para proporcionarlos.',
        'El envío de un formulario no garantiza la aceptación de la solicitud ni genera derechos adquiridos. La Institución evaluará cada solicitud de acuerdo a sus procedimientos internos y comunicará el resultado por los canales habituales.',
        'La Institución no se responsabiliza por errores cometidos por el usuario en la carga de datos.',
      ],
    },
    {
      id: 'listado-matriculados',
      titulo: '5. Listado de profesionales matriculados',
      parrafos: [
        'El listado de profesionales matriculados publicado en este sitio tiene carácter informativo y es actualizado periódicamente.',
        'La publicación de los datos de los matriculados se realiza en cumplimiento de las obligaciones legales de la Institución y en ejercicio de sus funciones como organismo de contralor de la matrícula profesional, conforme a la normativa provincial vigente.',
        'Los datos publicados son exclusivamente los necesarios para identificar al profesional habilitado ante la comunidad: nombre, apellido y número de matrícula.',
        'El matriculado tiene derecho a solicitar la corrección de sus datos en caso de error, dirigiéndose a la Institución por los canales oficiales.',
      ],
    },
    {
      id: 'pago-matricula',
      titulo: '6. Pago de matrícula',
      parrafos: [
        'El pago de matrícula se procesa a través de Mercado Pago, plataforma de pago de terceros operada por Mercado Libre S.R.L.',
        'Al hacer clic en "Pagar con Mercado Pago", el usuario será redirigido al sitio de dicha plataforma, donde se aplican los términos, condiciones y políticas de privacidad propios de Mercado Pago.',
        'La Institución no almacena ni tiene acceso a los datos de tarjetas de crédito, débito u otros medios de pago utilizados en la transacción.',
        'En caso de inconvenientes con el pago, el usuario debe contactarse con la Institución para verificar el estado de su matrícula.',
      ],
    },
    {
      id: 'alquileres',
      titulo: '7. Alquileres de espacios',
      parrafos: [
        'La información sobre espacios disponibles para alquiler publicada en este sitio tiene carácter meramente informativo.',
        'El envío de una consulta a través del formulario de alquileres no constituye una reserva ni genera ningún tipo de contrato. La disponibilidad y condiciones definitivas serán confirmadas directamente por la Institución.',
        'Cualquier contrato de alquiler se formalizará mediante instrumento escrito independiente, con los términos y condiciones específicos que se acuerden en cada caso.',
      ],
    },
    {
      id: 'obras-sociales',
      titulo: '8. Obras sociales',
      parrafos: [
        'La información sobre obras sociales adheridas, aranceles y requisitos de incorporación publicada en este sitio tiene carácter informativo y puede estar sujeta a actualizaciones.',
        'Para verificar la vigencia de la información, se recomienda contactar directamente a la Institución.',
        'El envío de una solicitud de incorporación a través del formulario no garantiza la aceptación. La Institución evaluará la solicitud conforme a sus criterios internos.',
      ],
    },
    {
      id: 'propiedad-intelectual',
      titulo: '9. Propiedad intelectual',
      parrafos: [
        'Todos los contenidos publicados en este sitio web, incluyendo textos, imágenes, logotipos, diseño gráfico y código fuente, son propiedad de la Institución o de sus proveedores, y se encuentran protegidos por las leyes de propiedad intelectual vigentes en la República Argentina.',
        'Queda prohibida la reproducción, distribución, transformación o comunicación pública de los contenidos del sitio sin autorización expresa de la Institución.',
        'El Boletín Oficial publicado en este sitio tiene carácter informativo. En caso de discrepancia, prevalecerá la publicación oficial del organismo gubernamental competente.',
      ],
    },
    {
      id: 'responsabilidad',
      titulo: '10. Limitación de responsabilidad',
      parrafos: [
        'La Institución realiza todos los esfuerzos razonables para mantener la información de este sitio actualizada y exacta, pero no garantiza la exactitud, integridad o vigencia de los contenidos publicados.',
        'La Institución no se responsabiliza por los daños o perjuicios de cualquier naturaleza que pudieran derivarse del uso o imposibilidad de uso del sitio web.',
        'El sitio puede contener enlaces a sitios web de terceros (como Mercado Pago o WhatsApp). La Institución no controla ni se responsabiliza por los contenidos o políticas de dichos sitios.',
        'La Institución no garantiza la disponibilidad continua e ininterrumpida del sitio web y podrá suspender temporalmente el acceso por razones de mantenimiento, actualización o causas de fuerza mayor.',
      ],
    },
    {
      id: 'jurisdiccion',
      titulo: '11. Legislación aplicable y jurisdicción',
      parrafos: [
        'Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina.',
        'Para la resolución de cualquier controversia derivada del uso del sitio, las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad de [CIUDAD], [PROVINCIA], renunciando a cualquier otro fuero que pudiera corresponderles.',
      ],
    },
    {
      id: 'contacto',
      titulo: '12. Contacto',
      parrafos: [
        'Para consultas relacionadas con los presentes Términos y Condiciones, puede contactarnos en:',
        '[NOMBRE DEL COLEGIO]\n[DOMICILIO LEGAL], [CIUDAD], [PROVINCIA]\nEmail: [EMAIL DE CONTACTO]\nTeléfono: [TELÉFONO]',
      ],
    },
  ],
};
