import type { PeopleRepository } from '@finq/server-data-access';
import type { CreatePersonDto, Person } from '@finq/shared-types';
import { createPeopleService } from './peopleService.js';
import { NotFoundError } from '../errors.js';

const samplePerson: Person = {
  id: 1,
  title: 'Mr',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'male',
  email: 'john.doe@example.com',
  phone: '555-1234',
  age: 30,
  dateOfBirth: '1994-01-01T00:00:00Z',
  streetNumber: 12,
  streetName: 'Main St',
  city: 'Springfield',
  state: 'IL',
  country: 'USA',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  largePhotoUrl: 'https://example.com/large.jpg',
};

function createMockRepository(): jest.Mocked<PeopleRepository> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
}

describe('peopleService', () => {
  it('listPeople delegates to repository.findAll', () => {
    const repository = createMockRepository();
    repository.findAll.mockReturnValue([samplePerson]);
    const service = createPeopleService(repository);

    expect(service.listPeople()).toEqual([samplePerson]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('createPerson delegates to repository.insert', () => {
    const repository = createMockRepository();
    repository.insert.mockReturnValue(samplePerson);
    const service = createPeopleService(repository);
    const dto: CreatePersonDto = samplePerson;

    expect(service.createPerson(dto)).toEqual(samplePerson);
    expect(repository.insert).toHaveBeenCalledWith(dto);
  });

  it('updatePerson returns the updated person when found', () => {
    const repository = createMockRepository();
    repository.update.mockReturnValue({ ...samplePerson, firstName: 'Jonathan' });
    const service = createPeopleService(repository);

    const result = service.updatePerson(1, { firstName: 'Jonathan' });

    expect(result.firstName).toBe('Jonathan');
    expect(repository.update).toHaveBeenCalledWith(1, { firstName: 'Jonathan' });
  });

  it('updatePerson throws NotFoundError when the repository finds nothing', () => {
    const repository = createMockRepository();
    repository.update.mockReturnValue(undefined);
    const service = createPeopleService(repository);

    expect(() => service.updatePerson(999, { firstName: 'Ghost' })).toThrow(NotFoundError);
  });

  it('deletePerson resolves silently when the repository removes a row', () => {
    const repository = createMockRepository();
    repository.remove.mockReturnValue(true);
    const service = createPeopleService(repository);

    expect(() => service.deletePerson(1)).not.toThrow();
  });

  it('deletePerson throws NotFoundError when nothing was removed', () => {
    const repository = createMockRepository();
    repository.remove.mockReturnValue(false);
    const service = createPeopleService(repository);

    expect(() => service.deletePerson(999)).toThrow(NotFoundError);
  });
});
