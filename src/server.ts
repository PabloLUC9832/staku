import express, { type Request, type Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor funcionando con TypeScript!');
});

app.get('/admin', (req: Request, res: Response) => {
  res.send('¡Servidor funcionando con ADMIN!');
});


app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});