import express from 'express';
import path from 'path';
import { InMemoryNewsRepository } from './infrastructure/repositories/InMemoryNewsRepository';
import { FileNewsRepository } from './infrastructure/repositories/FileNewsRepository';
import { NewsService } from './application/services/NewsService';
import { NewsController } from './interfaces/controllers/NewsController';
import { createApiRoutes } from './interfaces/routes/apiRoutes';
import { createWebRoutes } from './interfaces/routes/webRoutes';
import multer from 'multer';

export function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set('views', path.join(process.cwd(), 'src', 'views'));
  app.set('view engine', 'ejs');

  (app.locals as any).layout = function layout(name: string) {};

  // Archivos estáticos 
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Inyección de dependencias
  const repo = new FileNewsRepository();
  const service = new NewsService(repo);
  const controller = new NewsController(service);

  // Rutas
  app.use('/api', createApiRoutes(controller));
  app.use('/', createWebRoutes(controller));

  // Crear Noticia:
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  app.get('/crearNoticia', controller.createFormPage);
  app.post('/crearNoticia', upload.single('image'), controller.createPagePost);

  // Se comprueba que el servidor esté prendido
  app.get('/health', (_req, res) => res.json({ ok: true }));

  return app;
}