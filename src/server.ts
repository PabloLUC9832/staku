import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🏃 API de Corredores',
    endpoints: {
      admin: '/api/admin',
      data: '/api/data',
    },
  });
});

app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      timestamp: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error de conexión a BD',
    });
  }
});

// Rutas de la API
app.use('/api/admin', adminRoutes);
app.use('/api/data', clientRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});