import { generateProductDescription, moderateProductContent, moderateChatMessage } from '../service/geminiService.js';

const DATA_URL = /^data:(image\/[a-z]+);base64,(.+)$/is;
const MAX_IMAGES = 3;

/**
 * Genera una descripción sugerida para una publicación a partir de los datos del formulario y, opcionalmente, de las fotos.
 */
export const generateDescription = async (req, res) => {
    const { title, category, type, status, subject, imagesBase64 } = req.body;

    try {
        const images = (imagesBase64 ?? [])
            .slice(0, MAX_IMAGES)
            .map((dataUrl) => dataUrl.match(DATA_URL))
            .filter(Boolean)
            .map(([, mimeType, base64]) => ({ mimeType: mimeType.toLowerCase(), base64 }));

        const { description } = await generateProductDescription({
            title,
            category,
            type,
            status,
            subject,
            images,
        });

        res.status(200).json({ description });
    } catch (error) {
        console.error('[generateDescription] falló:', error.message);
        res.status(503).json({ error: 'No se pudo generar la descripción. Puedes escribirla manualmente.' });
    }
};

/**
 * Endpoint de moderación automática previa a publicar o actualizar un producto.
 */
export const moderateProduct = async (req, res) => {
    const { title, description, category, imagesBase64 } = req.body;

    try {
        const images = (imagesBase64 ?? [])
            .slice(0, MAX_IMAGES)
            .map((dataUrl) => dataUrl.match(DATA_URL))
            .filter(Boolean)
            .map(([, mimeType, base64]) => ({ mimeType: mimeType.toLowerCase(), base64 }));

        const result = await moderateProductContent({
            title,
            description,
            category,
            images,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('[moderateProduct] falló:', error.message);
        // Fallback resiliente: no bloquear al usuario si el servicio de IA falla temporalmente
        res.status(200).json({
            allowed: true,
            reason: 'Revisión automática omitida temporalmente.',
            category: null,
        });
    }
};

/**
 * Endpoint de moderación automática de mensajes de chat.
 */
export const moderateMessage = async (req, res) => {
    const { content } = req.body;

    try {
        const result = await moderateChatMessage({ content });
        res.status(200).json(result);
    } catch (error) {
        console.error('[moderateMessage] falló:', error.message);
        res.status(200).json({
            allowed: true,
            reason: 'Revisión automática de chat omitida.',
            category: null,
        });
    }
};