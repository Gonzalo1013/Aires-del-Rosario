import { defineCollection, z } from 'astro:content';


const books = defineCollection({
    schema: z.object({
        title: z.string(),
        img: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const collections = { books};