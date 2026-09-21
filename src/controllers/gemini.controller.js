import { generateProductDescription } from '../service/geminiService.js';

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