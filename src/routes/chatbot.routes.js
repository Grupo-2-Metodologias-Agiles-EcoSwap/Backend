import { Router } from 'express';
import { chatWithBot } from '../controllers/chatbot.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { chatbotRequestSchema } from '../schemas/chatbot.schema.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(chatbotRequestSchema), chatWithBot);

export default router;
