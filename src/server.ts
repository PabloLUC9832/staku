import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configurado para producción
const corsOptions = {
  origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
      : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🏃 API de Corredores',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      admin: '/api/admin',
      data: '/api/data',
    },
  });
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Error de conexión a BD',
    });
  }
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

// Manejo de rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});