import { defineCollection, z } from 'astro:content';


const books = defineCollection({
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        img: z.string().optional(),
        description: z.string().optional(),
    }),
});

const faqs = defineCollection({
    schema: z.object({
        question: z.string(),
        answer: z.string(),
    }),
});

export const collections = { books, faqs};