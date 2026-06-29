import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createLink, getUserLinks, getLinkStats, deleteLink } from '../controllers/linkController.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createLink);
router.get('/', getUserLinks);
router.get('/:id/stats', getLinkStats);
router.delete('/:id', deleteLink);

export default router;
