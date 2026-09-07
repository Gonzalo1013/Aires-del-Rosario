/**
 * Fuente única de las preguntas frecuentes: alimenta el acordeón de /faq y el
 * JSON-LD de FAQPage. Google exige que el texto del schema sea idéntico al
 * visible en la página, así que ambos deben salir siempre de acá.
 */
export interface Faq {
  question: string;
  /** Cada string es un párrafo. Se unen con espacios para el JSON-LD. */
  answer: string[];
  /**
   * Párrafo final opcional con un enlace interno. Se separa de `answer` porque
   * esos strings se renderizan como texto plano: acá hace falta markup.
   * El texto se suma igual al JSON-LD (`before` + `linkText` + `after`), ya que
   * Google exige que el schema diga exactamente lo mismo que se ve en pantalla.
   */
  cta?: {
    before: string;
    linkText: string;
    href: string;
    /** Normalmente el punto final. */
    after?: string;
  };
}

export const FAQS: Faq[] = [
  {
    question: '¿Cómo puedo calcular las frigorías necesarias para mi espacio?',
    answer: [
      'Se suele tomar como referencia 100 frigorías por m².',
      'Por ej.: un cuarto de 30m² necesita unas 3.000 frigorías. Si el espacio tiene muchas ventanas, techos altos o exposición solar, es recomendable aumentar a 120-130fg/m².',
      'La fórmula más precisa es: largo x ancho x alto x 50 (frigorías/h), o bien ajustar según condiciones específicas como orientación, aislamiento o carga térmica.',
    ],
    cta: {
      before: 'Podés calcularlo',
      linkText: 'acá',
      href: '/calculo/',
      after: '.',
    },
  },
  {
    question: '¿Qué tipo de mantenimiento necesita un aire acondicionado?',
    answer: [
      'Recomendamos un servicio anual que incluya:',
      'Limpieza de filtros y serpentines (evaporador y condensador);',
      'Control de presión de refrigerante;',
      'Revisión del drenaje;',
      'Comprobación de componentes eléctricos (capacitores, termostatos);',
      'En equipos inverter, verificación de sensores electrónicos.',
      'Así prolongás vida útil, evitás averías y optimizás consumo energético.',
    ],
  },
  {
    question: '¿Ofrecen garantía en sus servicios?',
    answer: [
      'Claro, todos nuestros trabajos tienen garantía profesional.',
      'Cumplimos con los requisitos del fabricante y la normativa vigente.',
      'Además brindamos cobertura propia sobre mano de obra por un período determinado, según el tipo de servicio.',
      'Consultanos y te lo detallamos por escrito.',
    ],
  },
  {
    question: '¿Cuánto tiempo demora la instalación de un aire acondicionado?',
    answer: [
      'Una instalación profesional suele durar entre 2 y 4 horas, dependiendo de:',
      'Tipo de equipo (split simple, multi-split, inverter);',
      'Complejidad de la conexión (tablero, tubería, ubicación);',
      'Acceso al espacio y condiciones estructurales.',
      'Nuestros técnicos matriculados planifican previamente para garantizar eficiencia, limpieza y cumplimiento de estándares.',
    ],
  },
  {
    question: '¿Qué marcas de aires acondicionados recomiendan?',
    answer: [
      'Trabajamos e instalamos todas las marcas del mercado: Samsung, LG, Midea, Surrey, Carrier, BGH, Hitachi, Sanyo, York, Tophouse, Noblex, Philips, Gafa, Electra, entre otras.',
      'La elección depende de tus necesidades —potencia, tipo de tecnología inverter, presupuesto y disponibilidad de postventa—.',
      'Te asesoramos para que elijas la mejor opción.',
    ],
  },
  {
    question: '¿Cómo puedo ahorrar en mis facturas de electricidad?',
    answer: [
      'Usá una configuración razonable (22-24°C) y evitá temperaturas demasiado bajas.',
      'Programá termostatos o modos “eco”.',
      'Mantené filtros limpios para mejorar la eficiencia.',
      'Complementá con ventiladores y cerrá cortinas para reducir carga térmica.',
    ],
  },
  {
    question: '¿Con qué frecuencia debería limpiar el filtro del aire?',
    answer: [
      'La vida útil depende del uso, mascotas y calidad del aire.',
      'Como regla general:',
      'Residencias sin mascotas: cada 2-3 meses.',
      'Con mascotas o alergias: cada 1-2 meses.',
    ],
  },
  {
    question: '¿Por qué mi aire acondicionado gotea agua o no enfría bien?',
    answer: [
      'Posibles causas:',
      'Drenaje tapado o serpentines congelados;',
      'Baja carga de gas (fuga), filtros sucios o fallas eléctricas.',
      'Ante estas situaciones, es mejor llamar a un técnico matriculado, ya que incluye diagnóstico correcto y solución profesional.',
    ],
  },
  {
    question: '¿Cada cuánto debe revisarse el gas refrigerante?',
    answer: [
      'Durante el mantenimiento anual verificamos niveles de gas y si hay fugas.',
      'Si existe una fuga, se debe reparar antes de recargar, para evitar daños ambientales y pérdida de eficiencia.',
    ],
  },
];
