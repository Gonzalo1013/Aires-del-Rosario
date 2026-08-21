import { defineCollection, z } from 'astro:content';

const books = defineCollection({
  // El helper image() valida la ruta y devuelve ImageMetadata, de modo que las
  // fotos de servicios pasan por el pipeline de optimización de astro:assets.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      img: image().optional(),
      /** background-position para el carrusel del home. Por defecto
       *  'center'; sirve para subir o bajar el recorte de una foto
       *  cuyo motivo no queda centrado en el slot de 1152x500. */
      imgPosition: z.string().optional(),
      description: z.string().optional(),
      order: z.number().optional(),
    }),
});

// Las FAQ viven en src/data/faqs.ts (no como colección): las consumen tanto el
// acordeón como el JSON-LD de FAQPage, y necesitan párrafos separados.

export const collections = { books };
