import { Router } from 'express';
import type { createPeopleController } from '../controllers/people.controller.js';

export function createPeopleRouter(controller: ReturnType<typeof createPeopleController>): Router {
  const router = Router();

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
