import { type Request, type Response } from 'express';
import { pool } from '../config/database';

export class DataController {
  static async getAllRunners(req: Request, res: Response) {
    try {
      const result = await pool.query(
          'SELECT * FROM runners ORDER BY position ASC'
      );

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error) {
      console.error('Error obteniendo corredores:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los datos',
      });
    }
  }

  static async getRunnerById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query(
          'SELECT * FROM runners WHERE id = $1',
          [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Corredor no encontrado',
        });
      }

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error obteniendo corredor:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el corredor',
      });
    }
  }

  static async getRunnersByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;

      const result = await pool.query(
          'SELECT * FROM runners WHERE category = $1 ORDER BY category_position ASC',
          [category]
      );

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error) {
      console.error('Error obteniendo corredores por categoría:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los corredores',
      });
    }
  }
}