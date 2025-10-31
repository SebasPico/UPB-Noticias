import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';

export function createApiRoutes(controller: NewsController): Router {
  const router = Router();
  router.get('/news', controller.listJson);
  router.post('/news', controller.createJson);
  return router;
}