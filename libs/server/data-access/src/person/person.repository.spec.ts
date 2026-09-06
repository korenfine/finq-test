import { DatabaseSync } from 'node:sqlite';
import type { CreatePersonDto } from '@finq/shared-types';
import { migrate } from '../db/migrate.js';
import { createPeopleRepository, type PeopleRepository } from './person.repository.js';

const samplePerson: CreatePersonDto = {
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

describe('peopleRepository', () => {
  let db: DatabaseSync;
  let repository: PeopleRepository;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    migrate(db);
    repository = createPeopleRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns an empty list when no people are saved', () => {
    expect(repository.findAll()).toEqual([]);
  });

  it('inserts a person and assigns an id', () => {
    const created = repository.insert(samplePerson);

    expect(created.id).toEqual(expect.any(Number));
    expect(created).toMatchObject(samplePerson);
  });

  it('finds an inserted person by id', () => {
    const created = repository.insert(samplePerson);

    const found = repository.findById(created.id);

    expect(found).toEqual(created);
  });

  it('returns undefined when finding a non-existent id', () => {
    expect(repository.findById(999)).toBeUndefined();
  });

  it('lists all inserted people with the most recently added first', () => {
    repository.insert(samplePerson);
    repository.insert({ ...samplePerson, firstName: 'Jane' });

    const all = repository.findAll();

    expect(all).toHaveLength(2);
    expect(all.map((p) => p.firstName)).toEqual(['Jane', 'John']);
  });

  it('updates only the provided fields', () => {
    const created = repository.insert(samplePerson);

    const updated = repository.update(created.id, { firstName: 'Jonathan' });

    expect(updated).toMatchObject({ ...samplePerson, firstName: 'Jonathan', id: created.id });
  });

  it('returns undefined when updating a non-existent id', () => {
    expect(repository.update(999, { firstName: 'Ghost' })).toBeUndefined();
  });

  it('removes a person and reports success', () => {
    const created = repository.insert(samplePerson);

    expect(repository.remove(created.id)).toBe(true);
    expect(repository.findById(created.id)).toBeUndefined();
  });

  it('reports failure when removing a non-existent id', () => {
    expect(repository.remove(999)).toBe(false);
  });
});
