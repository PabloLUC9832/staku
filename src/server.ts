import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Configuración simple y efectiva
app.use(cors({
  origin: [
    'https://staku-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight por 10 minutos
}));

// Headers adicionales de CORS (por si acaso)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requests (para debugging)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin') || 'No origin'}`);
  next();
});

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
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});