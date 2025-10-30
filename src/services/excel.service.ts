import XLSX from 'xlsx';
import { pool } from '../config/database';
import fs from 'fs';

interface RunnerData {
  bib: string;
  name: string;
  position: number;
  branch_position: number;
  category_position: number;
  laps: number;
  distance: number;
  mode: string;
  category: string;
  branch: string;
  club: string;
}

export class ExcelService {
  static async processExcel(filePath: string): Promise<{
    success: boolean;
    message: string;
    recordsProcessed?: number;
  }> {
    try {
      // Leer el archivo Excel
      const workbook = XLSX.readFile(filePath);
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return {
          success: false,
          message: 'El archivo Excel no contiene hojas',
        };
      }
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return {
          success: false,
          message: 'El archivo Excel no contiene hojas',
        };
      }
      const worksheet = workbook.Sheets[sheetName];
      // Verificar que la hoja exista
      if (!worksheet) {
        return {
          success: false,
          message: 'No se pudo leer la hoja del Excel',
        };
      }

      // Convertir a JSON
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return {
          success: false,
          message: 'El archivo Excel está vacío',
        };
      }

      // Debug: Ver columnas detectadas
      console.log('📋 Columnas detectadas:', Object.keys(data[0]));

      let recordsInserted = 0;

      for (const row of data) {
        const runner: RunnerData = {
          bib: row['Bib'] || '',
          name: row['Competidor'] || '',
          position: Number(row['Posición']) || 0,
          branch_position: Number(row['Posición Rama']) || 0,
          category_position: Number(row['Posición Categoría']) || 0,
          laps: Number(row['Laps']) || 0,
          distance: row['Distancia acumulada'] || '',
          mode: row['Modalidad'] || '',
          category: row['Categoria'] || '',
          branch: row['Rama'] || '',
          club: row['Club'] || '',
        };

        // Insertar en la base de datos
        await pool.query(
            `INSERT INTO runners
             (bib, name, position, branch_position, category_position, laps, distance, mode, category, branch, club)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              runner.bib,
              runner.name,
              runner.position,
              runner.branch_position,
              runner.category_position,
              runner.laps,
              runner.distance,
              runner.mode,
              runner.category,
              runner.branch,
              runner.club,
            ]
        );

        recordsInserted++;
      }

      // Eliminar el archivo temporal
      fs.unlinkSync(filePath);

      return {
        success: true,
        message: `${recordsInserted} corredores procesados exitosamente`,
        recordsProcessed: recordsInserted,
      };
    } catch (error) {
      console.error('Error procesando Excel:', error);

      // Eliminar archivo si hay error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        success: false,
        message: 'Error procesando el archivo Excel',
      };
    }
  }

  static async clearAllData(): Promise<boolean> {
    try {
      await pool.query('DELETE FROM runners');
      return true;
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return false;
    }
  }
}