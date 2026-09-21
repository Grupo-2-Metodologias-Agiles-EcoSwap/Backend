import { Router } from 'express';
import { generateDescription } from '../controllers/gemini.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { generateDescriptionSchema } from '../schemas/gemini.schema.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate-description', validate(generateDescriptionSchema), generateDescription);

export default router;