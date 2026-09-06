import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';

export function createHealthRouter(): Router {
  const router = Router();
  router.get('/', healthCheck);
  return router;
}
