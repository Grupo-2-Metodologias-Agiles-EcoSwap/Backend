import { askChatbot } from '../service/chatbotService.js';

/**
 * Responde un mensaje del asistente virtual (EcoBot).
 */
export const chatWithBot = async (req, res) => {
    const { message, history } = req.body;
    const fullName = req.user?.user_metadata?.full_name || req.user?.user_metadata?.name || '';
    const userName = fullName.trim().split(/\s+/)[0] || null;

    try {
        const result = await askChatbot({ message, history, userName, userId: req.user?.id });
        res.status(200).json(result);
    } catch (error) {
        console.error('[chatWithBot] falló:', error.message);
        res.status(503).json({ error: 'El asistente no está disponible en este momento. Intenta de nuevo en unos segundos.' });
    }
};
