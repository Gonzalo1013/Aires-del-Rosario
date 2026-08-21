# Fotos de la galería

Todo archivo `.jpg` / `.jpeg` / `.png` / `.webp` / `.avif` que se pegue en esta
carpeta aparece automáticamente en `/galeria`. No hay que tocar código: el
componente `src/components/GaleriaGrid.astro` las descubre en el build.

## Nombre del archivo

El nombre define dos cosas, así que conviene pensarlo un segundo:

1. **El orden** — es alfabético con orden numérico natural. Numerar al principio
   es lo que manda: `01-…`, `02-…`, `10-…` (el `10` va después del `9`, no del `1`).
2. **El texto alternativo** — se genera quitando la extensión y el número de
   orden, y cambiando los guiones por espacios. Google lo usa para posicionar la
   foto y los lectores de pantalla lo leen en voz alta.

```
01-instalacion-split-en-living.jpg   ->  alt: "Instalacion split en living"
02-preinstalacion-canerias-obra.jpg  ->  alt: "Preinstalacion canerias obra"
03.jpg                               ->  alt genérico (mejor evitarlo)
```

Sin tildes ni espacios ni ñ en el nombre del archivo: usá guiones.

Como el nombre no puede llevar tildes, el alt derivado queda telegráfico. El
texto bueno se escribe en `src/data/galeria.ts`, indexado por nombre de
archivo; lo que esté ahí tiene prioridad. No es obligatorio para que la foto
aparezca, pero conviene completarlo.

## Las fotos en sí

- **Subí los originales de la cámara o del celular, sin recortar ni redimensionar.**
  Astro genera solo las versiones chicas que necesita cada pantalla, en WebP.
  Si mandás una foto ya reducida, no hay forma de recuperar el detalle perdido.
- Si las pasás por WhatsApp, mandalas **como documento** y no como foto: enviadas
  como foto, WhatsApp las recomprime y bajan de calidad antes de llegar acá.
- Da igual si son verticales u horizontales: el mosaico acomoda cualquier mezcla.
- Si las fotos vienen de un celular Android, revisá que no se haya colado ningún
  archivo `.trashed-…`: son fotos borradas del celular que se sincronizan igual y
  que Finder no muestra.

## Importante: las fotos de esta carpeta están editadas

No son los originales. Pasaron por `scripts/editar-fotos-galeria.mjs`, que las
endereza (corrige la inclinación de cámara) y les ajusta el punto de negro, el
blanco y el brillo para que las 89 se vean parejas en el mosaico.

Por eso **una foto nueva pegada en crudo se va a notar**: más lavada y con la
cámara torcida al lado de las demás. Para sumar fotos:

```bash
# los originales van a una carpeta aparte, no acá
node scripts/editar-fotos-galeria.mjs ~/Desktop/fotos-nuevas --dry   # ver qué haría
node scripts/editar-fotos-galeria.mjs ~/Desktop/fotos-nuevas         # escribir acá
```

Escribe con el nombre del original, así que después hay que renombrarlas al
formato numerado y agregarles el alt en `src/data/galeria.ts`.

Los originales sin editar conviene guardarlos aparte (Drive, un disco): desde
acá no se pueden recuperar.
