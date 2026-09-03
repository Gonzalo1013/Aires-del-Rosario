/**
 * Textos alternativos de las fotos de la galería, por nombre de archivo.
 *
 * El nombre del archivo ya genera un alt automático (ver `GaleriaGrid.astro`),
 * pero no puede llevar tildes ni ñ, así que queda telegráfico y mal escrito.
 * Lo que se defina acá tiene prioridad: es el texto que lee un lector de
 * pantalla y el que usa Google para posicionar la imagen.
 *
 * No hace falta completar este mapa para agregar una foto nueva: si no está
 * listada, se usa el alt derivado del nombre. Conviene escribirlo igual.
 */
export const ALT_GALERIA: Record<string, string> = {
  '01-split-instalado-en-local-comercial.jpg':
    'Split instalado en un local comercial de Rosario',
  '02-tecnico-trabajando-en-la-unidad-interior.jpg':
    'Técnico trabajando en la unidad interior de un split',
  '03-split-instalado-en-living-de-casa.jpg':
    'Split instalado en el living de una casa en Rosario',
  '04-carga-de-gas-refrigerante-con-manometros.jpg':
    'Carga de gas refrigerante con manómetros en la unidad exterior',
  '05-split-instalado-en-centro-de-estetica.jpg':
    'Equipo split instalado en un centro de estética',
  '06-equipo-protegido-con-funda-para-el-service.jpg':
    'Equipo protegido con funda y nylon para hacerle el service',
  '07-consultorio-climatizado-con-split.jpg':
    'Consultorio climatizado con un equipo split',
  '08-bomba-de-vacio-y-manometros.jpg':
    'Bomba de vacío y manómetros conectados a la unidad exterior',
  '09-split-instalado-sobre-la-ventana.jpg':
    'Split instalado sobre la ventana de un dormitorio',
  '10-unidades-exteriores-apiladas-en-soportes.jpg':
    'Unidades exteriores apiladas en soportes de pared',
  '11-split-nuevo-en-pared-verde.jpg':
    'Split nuevo instalado en una pared verde con techo de madera',
  '12-unidad-interior-montada-con-soportes.jpg':
    'Unidad interior del split montada con soportes',
  '13-split-instalado-en-casa-con-techo-de-madera.jpg':
    'Split instalado en una casa con techo de madera',
  '14-unidad-exterior-en-pared-de-ladrillo.jpg':
    'Unidad exterior instalada en una pared de ladrillo',
  '15-split-instalado-en-oficina.jpg': 'Split instalado en una oficina',
  '16-equipos-y-herramientas-antes-de-empezar.jpg':
    'Equipos nuevos y herramientas listos antes de empezar la instalación',
  '17-split-negro-instalado-en-pared-blanca.jpg':
    'Split negro instalado en una pared blanca',
  '18-caneria-embutida-antes-de-tapar-la-pared.jpg':
    'Cañería embutida en la pared antes de taparla',
  '19-split-instalado-en-pared-salmon.jpg':
    'Split instalado en una pared color salmón',
  '20-tecnico-limpiando-el-split-en-altura.jpg':
    'Técnico limpiando un split en altura con la pared protegida',
  '21-split-instalado-en-dormitorio.jpg': 'Split instalado en un dormitorio',
  '22-equipo-cubierto-y-escalera-en-el-service.jpg':
    'Equipo cubierto y escalera durante el service del aire',
  '23-split-instalado-en-el-living-de-un-departamento.jpg':
    'Split instalado en el living de un departamento',
  '24-manometros-conectados-a-la-unidad-exterior.jpg':
    'Manómetros conectados a la unidad exterior durante la instalación',
  '25-split-en-sala-de-centro-de-estetica.jpg':
    'Split instalado en la sala de un centro de estética',
  '26-dos-unidades-exteriores-en-patio-interno.jpg':
    'Dos unidades exteriores instaladas en un patio interno',
  '27-split-sobre-la-camilla-del-consultorio.jpg':
    'Split instalado sobre la camilla de un consultorio',
  '28-caneria-con-curva-prolija-sobre-la-pared.jpg':
    'Cañería con la curva prolija sobre la pared',
  '29-split-instalado-en-ambiente-recien-pintado.jpg':
    'Split instalado en un ambiente recién pintado',
  '30-tecnico-nivelando-el-soporte-del-split.jpg':
    'Técnico nivelando el soporte del split antes de colgarlo',
  '31-split-instalado-en-pared-lisa.jpg': 'Split instalado en una pared lisa',
  '32-carga-de-gas-en-el-balcon.jpg':
    'Carga de gas de la unidad exterior en un balcón',
  '33-split-instalado-con-caneria-a-la-vista.jpg':
    'Split instalado con la cañería a la vista en una obra',
  '34-unidad-exterior-grande-en-azotea.jpg':
    'Unidad exterior de gran porte instalada en una azotea',
  '35-split-instalado-junto-a-la-ventana.jpg':
    'Split instalado junto a la ventana de un ambiente',
  '36-unidad-exterior-instalada-en-la-terraza.jpg':
    'Unidad exterior instalada en la terraza de una casa',
  '37-split-instalado-frente-a-la-ventana.jpg':
    'Split instalado frente a la ventana de un ambiente',
  '38-montaje-de-la-unidad-exterior-desde-la-ventana.jpg':
    'Técnico montando la unidad exterior desde la ventana',
  '39-split-instalado-en-ambiente-con-ventanal.jpg':
    'Split instalado en un ambiente con ventanal al patio',
  '40-equipo-con-funda-de-lavado-en-el-balcon.jpg':
    'Equipo con la funda de lavado puesta en un balcón',
  '41-split-instalado-en-ambiente-amplio.jpg':
    'Split instalado en un ambiente amplio',
  '42-unidad-exterior-instalada-de-noche.jpg':
    'Unidad exterior instalada de noche con vista a la ciudad',
  '43-split-instalado-sobre-el-mueble.jpg':
    'Split instalado sobre el mueble de un ambiente',
  '44-equipo-instalado-en-local-con-mural.jpg':
    'Equipo instalado en un local con mural pintado',
  '45-canaleta-abierta-para-la-preinstalacion.jpg':
    'Canaleta abierta en la pared para la preinstalación del equipo',
  '46-split-instalado-en-dormitorio-luminoso.jpg':
    'Split instalado en un dormitorio luminoso',
  '47-instalacion-de-split-con-vacio-y-carga.jpg':
    'Instalación de un split con vacío y carga de gas',
  '48-split-instalado-arriba-de-la-persiana.jpg':
    'Split instalado arriba de la persiana de un ambiente',
  '49-unidad-exterior-en-patio-de-luz.jpg':
    'Unidad exterior instalada en un patio de luz',
  '50-split-instalado-en-oficina-de-trabajo.jpg':
    'Split instalado en una oficina de trabajo',
  '51-caja-de-herramientas-del-equipo-tecnico.jpg':
    'Caja de herramientas del equipo técnico',
  '52-split-instalado-en-el-pasillo.jpg':
    'Split instalado en el pasillo de una casa',
  '53-unidad-exterior-y-herramientas-en-el-balcon.jpg':
    'Unidad exterior y herramientas de trabajo en un balcón',
  '54-split-instalado-sobre-la-biblioteca.jpg':
    'Split instalado sobre la biblioteca de un ambiente',
  '55-tecnico-desmontando-el-split-para-limpiarlo.jpg':
    'Técnico desmontando la unidad interior para limpiarla',
  '56-split-instalado-en-ambiente-claro.jpg':
    'Split instalado en un ambiente claro',
  '57-unidad-exterior-en-el-frente-de-un-local.jpg':
    'Unidad exterior instalada en el frente de un local',
  '58-split-instalado-en-dormitorio-con-ventanal.jpg':
    'Split instalado en un dormitorio con ventanal',
  '59-funda-de-lavado-colocada-en-el-split.jpg':
    'Funda de lavado colocada en el split para el mantenimiento',
  '60-split-instalado-en-pared-blanca.jpg':
    'Split instalado en una pared blanca',
  '61-unidad-exterior-instalada-en-un-balcon-chico.jpg':
    'Unidad exterior instalada en un balcón chico',
  '62-split-instalado-sobre-el-ventanal.jpg':
    'Split instalado sobre el ventanal de un ambiente',
  '63-conexion-de-cobre-de-la-unidad-interior.jpg':
    'Conexión de cobre de la unidad interior, en detalle',
  '64-split-instalado-arriba-de-la-puerta.jpg':
    'Split instalado arriba de la puerta de un ambiente',
  '65-recambio-de-un-equipo-antiguo.jpg':
    'Recambio de un equipo antiguo por uno nuevo',
  '66-split-instalado-sobre-la-cortina.jpg':
    'Split instalado sobre la cortina de un dormitorio',
  '67-unidad-exterior-instalada-en-el-patio.jpg':
    'Unidad exterior instalada en el patio de una casa',
  '68-split-instalado-en-pared-recien-pintada.jpg':
    'Split instalado en una pared recién pintada',
  '69-unidades-exteriores-en-la-terraza.jpg':
    'Unidades exteriores instaladas en una terraza',
  '70-split-instalado-junto-al-vano-de-la-puerta.jpg':
    'Split instalado junto al vano de una puerta',
  '71-varias-unidades-exteriores-en-soportes.jpg':
    'Varias unidades exteriores instaladas en soportes',
  '72-split-instalado-en-ambiente-con-cortina.jpg':
    'Split instalado en un ambiente con cortina',
  '73-herramientas-en-el-ambiente-durante-la-instalacion.jpg':
    'Herramientas en el ambiente durante la instalación del equipo',
  '74-split-instalado-en-dormitorio-de-departamento.jpg':
    'Split instalado en el dormitorio de un departamento',
  '75-unidad-exterior-en-el-balcon-del-patio.jpg':
    'Unidad exterior instalada en el balcón de un patio',
  '76-split-instalado-en-obra-con-cielorraso-nuevo.jpg':
    'Split instalado en una obra con el cielorraso nuevo',
  '77-equipo-cubierto-durante-la-limpieza.jpg':
    'Equipo cubierto y ambiente protegido durante la limpieza',
  '78-split-embalado-recien-colgado-en-obra.jpg':
    'Split recién colgado y todavía embalado en una obra',
  '79-obra-preparada-para-la-preinstalacion.jpg':
    'Obra preparada para la preinstalación de los equipos',
  '80-split-colgado-antes-de-terminar-la-pared.jpg':
    'Split colgado antes de terminar la pared',
  '81-unidad-exterior-instalada-en-el-patio-de-la-casa.jpg':
    'Unidad exterior instalada en el patio de una casa',
  '82-split-instalado-en-ambiente-luminoso.jpg':
    'Split instalado en un ambiente luminoso',
  '83-escalera-y-herramientas-en-el-ambiente.jpg':
    'Escalera y herramientas en el ambiente antes de instalar',
  '84-split-instalado-en-departamento-en-obra.jpg':
    'Split instalado en un departamento en obra',
  '85-unidad-exterior-en-la-fachada-del-local.jpg':
    'Unidad exterior instalada en la fachada de un local',
  '86-split-instalado-en-departamento-a-estrenar.jpg':
    'Split instalado en un departamento a estrenar',
  '87-caneria-de-la-unidad-exterior-en-altura.jpg':
    'Cañería de la unidad exterior en un edificio en altura',
  '88-split-instalado-en-pared-clara.jpg': 'Split instalado en una pared clara',
  '89-recorrido-de-canerias-dejado-en-obra.jpg':
    'Recorrido de cañerías dejado en obra',
  '90-preinstalacion-de-canerias-en-pared-de-ladrillo.jpg':
    'Preinstalación de cañerías y desagüe embutidos en una pared de ladrillo',
};
