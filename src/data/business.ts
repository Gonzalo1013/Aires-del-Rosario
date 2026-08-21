/**
 * Datos NAP (Name-Address-Phone) del negocio: única fuente de verdad.
 * Los consumen el Footer, el botón de WhatsApp y el JSON-LD de LocalBusiness,
 * así que Google ve exactamente los mismos datos que el usuario.
 *
 * PENDIENTE: falta la dirección de calle, el horario de atención y el link al
 * perfil de Google Business. Son las señales de mayor peso para el SEO local
 * y no se pueden inventar — agregarlas acá cuando estén disponibles.
 */
export const BUSINESS = {
  name: 'Aires del Rosario',
  description:
    'Instalación, reparación y mantenimiento de aires acondicionados en Rosario, Santa Fe. Técnicos matriculados especializados en placas electrónicas de equipos inverter.',
  email: 'airesderosario.service@gmail.com',
  /** Formato E.164, requerido por schema.org */
  phone: '+5493412297176',
  /** Solo dígitos, para los links de wa.me */
  whatsapp: '5493412297176',
  instagram: 'https://www.instagram.com/aires.delrosario',
  instagramHandle: '@aires.delrosario',
  city: 'Rosario',
  region: 'Santa Fe',
  country: 'AR',
  foundingDate: '2017',
} as const;

/**
 * "Atendemos en Rosario y alrededores" (ver /nosotros), sin especificar
 * localidades. Si el negocio confirma a qué partidos llega, conviene
 * enumerarlos acá como items City: mejora bastante el alcance local.
 */
export const AREA_SERVED = [
  { '@type': 'City', name: 'Rosario' },
  { '@type': 'AdministrativeArea', name: 'Gran Rosario' },
];
