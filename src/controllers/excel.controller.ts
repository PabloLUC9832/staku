import { type Request, type Response } from 'express';
import { ExcelService } from '../services/excel.service';

export class ExcelController {
  static async uploadExcel(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ningún archivo',
        });
      }

      const result = await ExcelService.processExcel(req.file.path);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error en uploadExcel:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  static async clearData(req: Request, res: Response) {
    try {
      const success = await ExcelService.clearAllData();

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Todos los datos fueron eliminados',
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar los datos',
        });
      }
    } catch (error) {
      console.error('Error en clearData:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }
}