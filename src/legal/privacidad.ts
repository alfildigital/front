/**
 * Política de Privacidad del sitio institucional.
 *
 * VERSIONADO:
 *   - Incrementar `version` cada vez que el contenido cambie sustancialmente.
 *   - Registrar el cambio en el historial al pie de este archivo.
 *   - El backend almacena la versión aceptada junto con el consentimiento del usuario.
 *
 * MARCO LEGAL:
 *   Esta política está redactada conforme a:
 *   - Ley 25.326 de Protección de Datos Personales (Argentina)
 *   - Disposición AAIP 7/2021 y normas complementarias
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
 *     [NOMBRE RESPONSABLE]  →  nombre del responsable del tratamiento de datos
 *
 * HISTORIAL DE VERSIONES:
 *   v1.0 (2025-01-01) — Versión inicial.
 */

import type { LegalDocument } from './terminos';

export const politicaDePrivacidad: LegalDocument = {
  version: '1.0',
  fechaVigencia: '2025-01-01',
  titulo: 'Política de Privacidad',
  subtitulo:
    'En cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina, informamos cómo recopilamos, utilizamos y protegemos sus datos personales.',

  secciones: [
    {
      id: 'responsable',
      titulo: '1. Responsable del tratamiento de datos',
      parrafos: [
        '[NOMBRE DEL COLEGIO] (en adelante, "la Institución"), con domicilio legal en [DOMICILIO LEGAL], [CIUDAD], [PROVINCIA], Argentina, CUIT [CUIT], es el responsable del tratamiento de los datos personales recopilados a través de este sitio web.',
        'El responsable a cargo del tratamiento de datos es [NOMBRE RESPONSABLE]. Para cualquier consulta relacionada con sus datos personales, puede contactarnos en: [EMAIL DE CONTACTO] | [TELÉFONO].',
      ],
    },
    {
      id: 'datos-recopilados',
      titulo: '2. Datos personales que recopilamos',
      parrafos: [
        'A través de los formularios de este sitio web recopilamos los siguientes datos personales, según el formulario utilizado:',
        'Formulario de consulta de alquileres: nombre y apellido, dirección de correo electrónico, número de teléfono, y el mensaje o consulta ingresada por el usuario.',
        'Formulario de solicitud de incorporación al convenio de obras sociales: nombre y apellido, dirección de correo electrónico, especialidad profesional, y el mensaje o consulta ingresada.',
        'En ambos casos también registramos: fecha y hora de la solicitud, versión de los documentos legales aceptados, y los consentimientos otorgados por el usuario.',
        'Adicionalmente, el servidor web registra automáticamente la dirección IP del dispositivo desde el cual se realizó la solicitud, como parte del registro de auditoría del consentimiento.',
        'No recopilamos datos sensibles en los términos del artículo 2 de la Ley 25.326.',
      ],
    },
    {
      id: 'finalidades',
      titulo: '3. Finalidades del tratamiento',
      parrafos: [
        'Los datos personales recopilados son utilizados exclusivamente para las siguientes finalidades:',
        'Consultas de alquileres: gestionar y responder la consulta del usuario sobre espacios disponibles para alquiler.',
        'Solicitudes de obras sociales: evaluar y gestionar la solicitud de incorporación al convenio, y comunicarse con el solicitante durante el proceso.',
        'Auditoría de consentimientos: registrar de forma fehaciente la aceptación de los términos y condiciones y la política de privacidad, conforme a las obligaciones legales de la Institución.',
        'Comunicaciones institucionales (solo cuando el usuario lo autorice expresamente): enviar información sobre novedades, actividades y comunicaciones de la Institución.',
        'Los datos no serán utilizados para ninguna finalidad incompatible con las indicadas anteriormente.',
      ],
    },
    {
      id: 'base-legal',
      titulo: '4. Base legal del tratamiento',
      parrafos: [
        'El tratamiento de los datos personales ingresados en los formularios se realiza sobre la base del consentimiento libre, expreso e informado del usuario, otorgado al aceptar los presentes documentos legales antes de enviar el formulario (artículo 5 de la Ley 25.326).',
        'El registro del consentimiento (versión del documento, fecha, hora e IP) responde a una obligación legal de la Institución de mantener evidencia de dicho consentimiento.',
        'La publicación de datos de matriculados (nombre, apellido y número de matrícula) responde al ejercicio de funciones públicas de contralor de la matrícula profesional, en cumplimiento de la normativa provincial aplicable.',
      ],
    },
    {
      id: 'destinatarios',
      titulo: '5. Destinatarios y transferencia de datos',
      parrafos: [
        'Los datos personales proporcionados por los usuarios no son cedidos, vendidos ni transferidos a terceros, salvo en los siguientes casos:',
        'Prestadores de servicios: proveedores tecnológicos que brindan servicios de soporte técnico o alojamiento del sistema, bajo obligación contractual de confidencialidad y solo en la medida necesaria para prestar dichos servicios.',
        'Obligaciones legales: cuando sea requerido por autoridades competentes en cumplimiento de disposiciones legales o resoluciones judiciales.',
        'No se realizan transferencias internacionales de datos personales.',
      ],
    },
    {
      id: 'plazo-conservacion',
      titulo: '6. Plazo de conservación',
      parrafos: [
        'Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados y para cumplir con las obligaciones legales aplicables.',
        'Los registros de consentimiento (auditoría) serán conservados por un período mínimo de cinco (5) años, a efectos de acreditar el consentimiento otorgado por el usuario.',
        'Una vez transcurrido el plazo de conservación, los datos serán eliminados o anonimizados de manera segura.',
      ],
    },
    {
      id: 'seguridad',
      titulo: '7. Medidas de seguridad',
      parrafos: [
        'La Institución implementa medidas técnicas y organizativas adecuadas para proteger los datos personales contra accesos no autorizados, pérdida, destrucción o divulgación accidental.',
        'La comunicación entre el navegador del usuario y el servidor del sitio web se realiza mediante protocolo HTTPS (cifrado TLS).',
        'El acceso a los datos personales está restringido al personal autorizado de la Institución que necesite acceder a ellos para cumplir con las finalidades indicadas.',
        'A pesar de estas medidas, ningún sistema de transmisión de datos por Internet puede garantizar seguridad absoluta. La Institución adopta todas las precauciones razonables para proteger la información.',
      ],
    },
    {
      id: 'derechos',
      titulo: '8. Derechos del titular de los datos',
      parrafos: [
        'En virtud de la Ley 25.326, el titular de los datos personales tiene derecho a:',
        'Acceso: conocer qué datos personales suyos obran en nuestros registros, su origen, destinatarios y finalidad de uso (artículo 14).',
        'Rectificación: solicitar la corrección de datos inexactos, incompletos o desactualizados (artículo 16).',
        'Supresión: solicitar la eliminación de sus datos cuando hayan dejado de ser necesarios para la finalidad que motivó su recopilación, o cuando retire su consentimiento (artículo 16).',
        'Confidencialidad: solicitar que sus datos sean tratados con reserva cuando su difusión pueda causarle perjuicios (artículo 17).',
        'Para ejercer cualquiera de estos derechos, el titular debe dirigirse por escrito a la Institución en [DOMICILIO LEGAL], [CIUDAD], [PROVINCIA], o por correo electrónico a [EMAIL DE CONTACTO], acreditando su identidad.',
        'La AAIP (Agencia de Acceso a la Información Pública), en su carácter de Órgano de Control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
      ],
    },
    {
      id: 'ip-auditoria',
      titulo: '9. Dirección IP y registro de auditoría',
      parrafos: [
        'Cuando el usuario envía un formulario a través de este sitio web, el servidor de la Institución registra automáticamente la dirección IP del dispositivo desde el cual se realizó la solicitud.',
        'Este registro tiene exclusivamente la finalidad de mantener un registro fehaciente de los consentimientos otorgados, en cumplimiento de las obligaciones legales de la Institución. La dirección IP no es utilizada para identificar al usuario individualmente ni para ninguna otra finalidad.',
        'La dirección IP es capturada directamente por el servidor al momento de recibir la solicitud y no es enviada por el navegador del usuario como dato separado.',
      ],
    },
    {
      id: 'cookies',
      titulo: '10. Cookies y tecnologías similares',
      parrafos: [
        'Este sitio web utiliza el almacenamiento local del navegador (localStorage) para recordar la preferencia de tema visual (modo claro / modo sustentable) seleccionada por el usuario. Esta información permanece exclusivamente en el dispositivo del usuario y no es transmitida a ningún servidor.',
        'El sitio puede utilizar cookies técnicas estrictamente necesarias para el funcionamiento de la aplicación. No se utilizan cookies de seguimiento, perfilado ni publicidad.',
        'Si se incorporan herramientas de análisis de tráfico web en el futuro, esta política será actualizada y los usuarios serán informados.',
      ],
    },
    {
      id: 'terceros',
      titulo: '11. Servicios de terceros',
      parrafos: [
        'Este sitio web integra o enlaza a los siguientes servicios de terceros, que tienen sus propias políticas de privacidad:',
        'Mercado Pago (Mercado Libre S.R.L.): utilizado para el procesamiento del pago de matrícula. Cuando el usuario hace clic en "Pagar con Mercado Pago", es redirigido al sitio de Mercado Pago. La Institución no tiene acceso ni control sobre los datos que Mercado Pago recopila durante el proceso de pago.',
        'WhatsApp (Meta Platforms, Inc.): los enlaces de consulta por WhatsApp redirigen a la aplicación WhatsApp. La Institución no tiene acceso ni control sobre los datos que Meta recopila.',
        'Se recomienda al usuario revisar las políticas de privacidad de cada uno de estos servicios antes de utilizarlos.',
      ],
    },
    {
      id: 'menores',
      titulo: '12. Menores de edad',
      parrafos: [
        'Este sitio web no está destinado a menores de 18 años ni recopila conscientemente datos personales de menores. Si la Institución detecta que ha recibido datos de un menor sin consentimiento parental, procederá a eliminarlos.',
      ],
    },
    {
      id: 'actualizaciones',
      titulo: '13. Actualizaciones de esta política',
      parrafos: [
        'La Institución se reserva el derecho de modificar la presente Política de Privacidad cuando sea necesario, por cambios en la legislación aplicable, en los servicios ofrecidos o en las prácticas de tratamiento de datos.',
        'Los cambios sustanciales serán comunicados mediante aviso en el sitio web. La versión vigente siempre estará disponible en /politica-de-privacidad.',
        'La fecha de la última actualización y el número de versión son visibles al inicio de este documento.',
      ],
    },
    {
      id: 'contacto',
      titulo: '14. Contacto',
      parrafos: [
        'Para consultas, solicitudes de ejercicio de derechos o cualquier comunicación relacionada con la presente política, puede contactarnos en:',
        '[NOMBRE DEL COLEGIO]\n[DOMICILIO LEGAL], [CIUDAD], [PROVINCIA]\nEmail: [EMAIL DE CONTACTO]\nTeléfono: [TELÉFONO]',
      ],
    },
  ],
};
