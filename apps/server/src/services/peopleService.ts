import type { CreatePersonDto, Person, UpdatePersonDto } from '@finq/shared-types';
import type { PeopleRepository } from '@finq/server-data-access';
import { NotFoundError } from '../errors.js';

export function createPeopleService(repository: PeopleRepository) {
  return {
    listPeople(): Person[] {
      return repository.findAll();
    },

    createPerson(dto: CreatePersonDto): Person {
      return repository.insert(dto);
    },

    updatePerson(id: number, dto: UpdatePersonDto): Person {
      const updated = repository.update(id, dto);
      if (!updated) {
        throw new NotFoundError(`Person ${id} not found`);
      }
      return updated;
    },

    deletePerson(id: number): void {
      const removed = repository.remove(id);
      if (!removed) {
        throw new NotFoundError(`Person ${id} not found`);
      }
    },
  };
}

export type PeopleService = ReturnType<typeof createPeopleService>;
