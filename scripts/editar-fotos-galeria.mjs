/**
 * Prepara fotos para la galería: las endereza y les ajusta el tono.
 *
 *   node scripts/editar-fotos-galeria.mjs <carpeta-de-originales> [--dry]
 *
 * Lee los originales de la carpeta que se le pase y escribe el resultado en
 * src/assets/galeria/, conservando el nombre de cada archivo. Los originales no
 * se tocan nunca, así que se puede volver a correr con otros parámetros.
 *
 * No forma parte del build: es una herramienta para usar cuando se suman fotos
 * nuevas, porque una foto cruda al lado de las editadas se nota (más lavada y
 * con la cámara torcida).
 *
 * ---------------------------------------------------------------------------
 * QUÉ HACE, Y QUÉ NO
 *
 * 1. ENDEREZADO. Estima la inclinación de cámara y la corrige. La estimación es
 *    el método clásico de "deskew" por proyección: se detectan los bordes
 *    fuertes, se separan en casi-verticales y casi-horizontales, y se busca el
 *    ángulo que hace que se apilen en la menor cantidad de columnas (o filas).
 *    Cuando las verticales de la escena están verticales de verdad, la
 *    proyección tiene picos altos y angostos.
 *
 *    Corrige el GIRO de la cámara. NO corrige la PERSPECTIVA: si la foto se
 *    tomó desde abajo, el equipo se ve trapezoidal y eso no es inclinación —
 *    rotar esa foto endereza el equipo pero tuerce el ambiente. Por eso los
 *    ángulos grandes (más de 4.5°) se descartan: a esa altura casi siempre es
 *    perspectiva, no giro.
 *
 * 2. TONO. Punto de negro y de blanco por percentiles, y brillo hacia un
 *    objetivo común para que el conjunto se vea parejo en el mosaico. Los topes
 *    son deliberados y cada uno viene de un caso real que se rompió sin él:
 *      - el punto de blanco no se toca si la foto ya venía quemada (había una
 *        con el 20% de los píxeles en blanco puro: ahí no hay nada que rescatar);
 *      - el punto de negro no se levanta más de 30, porque en una foto lavada
 *        el percentil 1 puede estar en 150 y estirar desde ahí la destruye;
 *      - del brillo se corrige sólo la mitad de la desviación (de ahí la raíz
 *        cuadrada), porque igualar las 89 al mismo brillo estaría mal: una foto
 *        de noche tiene que seguir siendo de noche.
 */
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp'; // viene con Astro (astro:assets lo usa por debajo)

const DESTINO = 'src/assets/galeria';

// --- enderezado ---
const ANCHO_MEDICION = 400;
const ANGULO_BUSQUEDA = 6; // rango de búsqueda, en grados
const PASO = 0.25;
const ANGULO_MIN = 0.4; // por debajo no se nota y el recorte no vale la pena
const ANGULO_MAX = 4.5; // por encima suele ser perspectiva, no giro
const GANANCIA_MIN = 1.08; // mejora mínima de la proyección para creerle
const BORDES_MIN = 4000; // sin suficientes bordes, la medición es ruido

// --- tono ---
const BRILLO_OBJETIVO = 150;
const PENDIENTE_MAX = 1.3;
const NEGRO_MAX = 30;
const BLANCO_MIN = 205;
const BRILLO_MIN = 0.88;
const BRILLO_MAX = 1.14;
const SATURACION = 1.06;

const LADO_LARGO = 1800; // el mosaico muestra 1152px como máximo

function bordes(data, w, h) {
  const vert = [];
  const horiz = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const dx = Math.abs(data[i + 1] - data[i - 1]);
      const dy = Math.abs(data[i + w] - data[i - w]);
      if (dx > 40 && dx > dy * 2.5) vert.push([x, y, dx]);
      else if (dy > 40 && dy > dx * 2.5) horiz.push([x, y, dy]);
    }
  }
  return { vert, horiz };
}

function nitidez(puntos, tan, largo, esVertical) {
  const off = Math.ceil(Math.abs(tan) * largo);
  const bins = new Float64Array(largo + off * 2 + 2);
  let total = 0;
  for (const [x, y, peso] of puntos) {
    const p = esVertical ? x - y * tan : y - x * tan;
    const idx = Math.round(p) + off;
    if (idx >= 0 && idx < bins.length) {
      bins[idx] += peso;
      total += peso;
    }
  }
  if (total === 0) return 0;
  let suma = 0;
  for (const v of bins) suma += (v / total) ** 2;
  return suma;
}

async function medir(ruta) {
  const base = sharp(ruta, { failOn: 'none' }).rotate();

  const { data, info } = await base
    .clone()
    .resize({ width: ANCHO_MEDICION, fit: 'inside' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { vert, horiz } = bordes(data, info.width, info.height);

  let mejor = { angulo: 0, puntaje: -1 };
  let enCero = 0;
  for (let a = -ANGULO_BUSQUEDA; a <= ANGULO_BUSQUEDA + 1e-9; a += PASO) {
    const tan = Math.tan((a * Math.PI) / 180);
    const p =
      nitidez(vert, tan, info.width, true) * vert.length +
      nitidez(horiz, tan, info.height, false) * horiz.length;
    if (Math.abs(a) < 1e-9) enCero = p;
    if (p > mejor.puntaje) mejor = { angulo: a, puntaje: p };
  }

  const gris = await base.clone().greyscale().raw().toBuffer();
  const hist = new Uint32Array(256);
  for (const v of gris) hist[v]++;
  const percentil = (frac) => {
    let acum = 0;
    for (let v = 0; v < 256; v++) {
      acum += hist[v];
      if (acum >= gris.length * frac) return v;
    }
    return 255;
  };
  const stats = await base.clone().greyscale().stats();

  return {
    angulo: mejor.angulo,
    ganancia: mejor.puntaje / (enCero || 1),
    bordes: vert.length + horiz.length,
    brillo: stats.channels[0].mean,
    p1: percentil(0.01),
    p99: percentil(0.99),
  };
}

function anguloAAplicar(m) {
  const a = Math.abs(m.angulo);
  if (a < ANGULO_MIN || a > ANGULO_MAX) return 0;
  if (m.ganancia < GANANCIA_MIN) return 0;
  if (m.bordes < BORDES_MIN) return 0;
  return m.angulo;
}

function tono(m) {
  const negro = m.p1 > 12 ? Math.min(m.p1 - 4, NEGRO_MAX) : 0;
  const blanco = m.p99 >= 240 ? 255 : Math.max(m.p99, BLANCO_MIN);
  const pendiente = Math.min(255 / Math.max(blanco - negro, 1), PENDIENTE_MAX);
  const corte = -pendiente * negro;
  const trasLineal = Math.min(255, Math.max(1, m.brillo * pendiente + corte));
  const brillo = Math.min(
    BRILLO_MAX,
    Math.max(BRILLO_MIN, Math.sqrt(BRILLO_OBJETIVO / trasLineal))
  );
  return { pendiente, corte, brillo };
}

/**
 * Rectángulo más grande con la misma proporción que entra en una foto W×H
 * rotada θ grados. Sale de las dos condiciones de encaje:
 *   w·cos + h·sen ≤ W   y   w·sen + h·cos ≤ H
 */
function recorteInscripto(W, H, grados) {
  const t = (Math.abs(grados) * Math.PI) / 180;
  const cos = Math.cos(t);
  const sen = Math.sin(t);
  const r = W / H;
  const h = Math.min(W / (r * cos + sen), H / (r * sen + cos));
  return { w: Math.floor(r * h), h: Math.floor(h) };
}

async function procesar(origen, destino) {
  const m = await medir(origen);
  const grados = anguloAAplicar(m);
  const t = tono(m);

  let img = sharp(origen, { failOn: 'none' }).rotate();

  if (grados !== 0) {
    const { width: W, height: H } = await sharp(origen, { failOn: 'none' })
      .rotate()
      .metadata();
    const rot = await img
      .rotate(-grados, { background: '#000' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const dentro = recorteInscripto(W, H, grados);
    img = sharp(rot.data, {
      raw: {
        width: rot.info.width,
        height: rot.info.height,
        channels: rot.info.channels,
      },
    }).extract({
      left: Math.round((rot.info.width - dentro.w) / 2),
      top: Math.round((rot.info.height - dentro.h) / 2),
      width: dentro.w,
      height: dentro.h,
    });
  }

  await img
    .resize(LADO_LARGO, LADO_LARGO, {
      fit: 'inside',
      withoutEnlargement: true,
      kernel: 'lanczos3',
    })
    .linear(t.pendiente, t.corte)
    .modulate({ brightness: t.brillo, saturation: SATURACION })
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.7 })
    // sin metadatos: el EXIF del celular lleva el GPS del domicilio del cliente
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(destino);

  return { grados, ...t };
}

const [carpeta, ...flags] = process.argv.slice(2);
if (!carpeta) {
  console.error(
    'Uso: node scripts/editar-fotos-galeria.mjs <carpeta-de-originales> [--dry]'
  );
  process.exit(1);
}
const dry = flags.includes('--dry');

const archivos = readdirSync(carpeta)
  .filter((f) => /\.jpe?g$/i.test(f) && !f.startsWith('.'))
  .sort();

if (archivos.length === 0) {
  console.error('No hay .jpg en ' + carpeta);
  process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });
let enderezadas = 0;
for (const archivo of archivos) {
  const origen = path.join(carpeta, archivo);
  if (dry) {
    const m = await medir(origen);
    const g = anguloAAplicar(m);
    console.log(
      `${archivo}  inclinación ${m.angulo.toFixed(2)}° -> ${g === 0 ? 'no se toca' : g.toFixed(2) + '°'}  brillo ${Math.round(m.brillo)}`
    );
    continue;
  }
  const r = await procesar(origen, path.join(DESTINO, archivo));
  if (r.grados !== 0) enderezadas++;
  const kb = Math.round(statSync(path.join(DESTINO, archivo)).size / 1024);
  console.log(
    `${archivo}  giro ${r.grados.toFixed(2)}°  contraste x${r.pendiente.toFixed(2)}  brillo x${r.brillo.toFixed(2)}  ${kb} KB`
  );
}

if (!dry) {
  console.log(
    `\n${archivos.length} fotos listas en ${DESTINO} (${enderezadas} enderezadas).`
  );
  console.log(
    'Ojo: se escribieron con el nombre del original. Si la galería usa nombres numerados, renombralas.'
  );
}
