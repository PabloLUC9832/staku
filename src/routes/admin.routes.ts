import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import { ExcelController } from '../controllers/excel.controller';

const router = Router();

// POST /api/admin/upload - Subir Excel
router.post('/upload', upload.single('file'), ExcelController.uploadExcel);

// DELETE /api/admin/clear - Limpiar todos los datos
router.delete('/clear', ExcelController.clearData);

export default router;