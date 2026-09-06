import express, { type Express } from 'express';
import cors from 'cors';
import type { DatabaseSync } from 'node:sqlite';
import { createPeopleRepository, getDb, migrate } from '@finq/server-data-access';
import { createPeopleService } from './services/peopleService.js';
import { createPeopleController } from './controllers/people.controller.js';
import { createPeopleRouter } from './routes/people.routes.js';
import { createHealthRouter } from './routes/health.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(db: DatabaseSync = getDb()): Express {
  migrate(db);

  const repository = createPeopleRepository(db);
  const service = createPeopleService(repository);
  const controller = createPeopleController(service);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', createHealthRouter());
  app.use('/people', createPeopleRouter(controller));

  app.use(errorHandler);

  return app;
}
