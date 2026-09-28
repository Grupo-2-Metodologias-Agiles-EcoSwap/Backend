import { z } from 'zod';

const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,.+/i;

export const generateDescriptionSchema = z
    .object({
        title: z.string().trim().max(100).nullish(),
        category: z.string().trim().max(60).nullish(), // nombre de la categoría, no el id
        type: z.enum(['sale', 'wanted']).nullish(),
        status: z.string().trim().max(30).nullish(),
        subject: z.string().trim().max(100).nullish(),

        imagesBase64: z
            .array(z.string())
            .transform((arr) => arr.filter((s) => IMAGE_DATA_URL.test(s)))
            .nullish(),
    })
    .refine(
        (d) => d.title || (d.imagesBase64 && d.imagesBase64.length > 0),
        'Envía al menos un título o una imagen nueva'
    );

export const descriptionResultSchema = z.object({
    description: z.string().min(1).max(600).describe('Descripción de la publicación en español'),
});

export const moderateProductSchema = z.object({
    title: z.string().trim().min(1, 'El título es obligatorio para moderar'),
    description: z.string().trim().nullish(),
    category: z.string().trim().nullish(),
    imagesBase64: z
        .array(z.string())
        .transform((arr) => arr.filter((s) => IMAGE_DATA_URL.test(s)))
        .nullish(),
});

export const moderationResultSchema = z.object({
    allowed: z.boolean().describe('true si el contenido cumple con las normas de un marketplace universitario seguro, false si viola las normas'),
    reason: z.string().describe('Explicación concisa y constructiva en español para el estudiante'),
    category: z.string().nullable().describe('Categoría de infracción si fue rechazado (e.g., "Fraude académico", "Sustancias prohibidas", "Lenguaje ofensivo", "Armas o peligro"), o null si es válido')
});

export const moderateMessageSchema = z.object({
    content: z.string().trim().min(1, 'El mensaje no puede estar vacío').max(1000),
});