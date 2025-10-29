import { Router } from 'express';
import { DataController } from '../controllers/data.controller';

const router = Router();

// GET /api/data - Obtener todos los corredores
router.get('/', DataController.getAllRunners);

// GET /api/data/:id - Obtener un corredor por ID
router.get('/:id', DataController.getRunnerById);

// GET /api/data/category/:category - Obtener por categoría
router.get('/category/:category', DataController.getRunnersByCategory);

export default router;