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

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Vista y plantillas (MVT)
  app.set('views', path.join(process.cwd(), 'src', 'views'));
  app.set('view engine', 'ejs');
  // Soportar layouts con ejs-mate-like mediante include manual; aquí usamos ejs con layout helper
  // Nota: EJS soporta layouts mediante ejs-locals, pero no lo añadimos para mantenerlo mínimo.
  (app.locals as any).layout = function layout(name: string) { /* no-op placeholder */ };

  // Inyección de dependencias (alta cohesión, bajo acoplamiento)
  const repo = new FileNewsRepository();
  const service = new NewsService(repo);
  const controller = new NewsController(service);

  // Rutas
  app.use('/api', createApiRoutes(controller));
  app.use('/', createWebRoutes(controller));
  // Crear Noticia: formulario y POST con imagen (<=10MB)
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  app.get('/crearNoticia', controller.createFormPage);
  app.post('/crearNoticia', upload.single('image'), controller.createPagePost);

  // Salud
  app.get('/health', (_req, res) => res.json({ ok: true }));

  return app;
}