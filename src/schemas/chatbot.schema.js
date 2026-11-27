import { z } from 'zod';

const MAX_HISTORY = 12;

export const chatbotRequestSchema = z.object({
    message: z.string().trim().min(1, 'Escribe un mensaje').max(1000, 'El mensaje es demasiado largo'),
    history: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant']),
                text: z.string().trim().min(1).max(2000),
            })
        )
        .default([])
        // Solo se conservan los últimos turnos para acotar el tamaño del prompt
        .transform((arr) => arr.slice(-MAX_HISTORY)),
});

export const chatbotResultSchema = z.object({
    reply: z
        .string()
        .min(1)
        .max(1500)
        .describe('Respuesta para el estudiante, en español, breve y clara (texto plano, sin markdown)'),
    productIds: z
        .array(z.string())
        .max(4)
        .describe('IDs exactos de productos del catálogo recomendados en la respuesta; lista vacía si no aplica'),
});
