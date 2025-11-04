import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';

//Rutas dependiendo de que jornada sea
export function createWebRoutes(controller: NewsController): Router {
  const router = Router();
  router.get('/', (_req, res) => res.redirect('/jornada/1'));
  router.get('/jornada/:id', controller.jornadaPage);
  return router;
}