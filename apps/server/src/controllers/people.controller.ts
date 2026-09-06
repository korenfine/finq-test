import type { NextFunction, Request, Response } from 'express';
import { createPersonSchema, updatePersonSchema } from '@finq/shared-types';
import type { PeopleService } from '../services/peopleService.js';

export function createPeopleController(service: PeopleService) {
  return {
    list(_req: Request, res: Response, next: NextFunction) {
      try {
        res.json(service.listPeople());
      } catch (err) {
        next(err);
      }
    },

    create(req: Request, res: Response, next: NextFunction) {
      try {
        const dto = createPersonSchema.parse(req.body);
        res.status(201).json(service.createPerson(dto));
      } catch (err) {
        next(err);
      }
    },

    update(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        const dto = updatePersonSchema.parse(req.body);
        res.json(service.updatePerson(id, dto));
      } catch (err) {
        next(err);
      }
    },

    remove(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        service.deletePerson(id);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
