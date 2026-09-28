import { Router } from 'express';
import { generateDescription, moderateProduct, moderateMessage } from '../controllers/gemini.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { generateDescriptionSchema, moderateProductSchema, moderateMessageSchema } from '../schemas/gemini.schema.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate-description', validate(generateDescriptionSchema), generateDescription);
router.post('/moderate-product', validate(moderateProductSchema), moderateProduct);
router.post('/moderate-message', validate(moderateMessageSchema), moderateMessage);

export default router;