import type { DatabaseSync } from 'node:sqlite';
import type { CreatePersonDto, Person, UpdatePersonDto } from '@finq/shared-types';
import { PERSON_COLUMN_BY_FIELD, rowToPerson, type PersonRow } from './person.model.js';

export interface PeopleRepository {
  findAll(): Person[];
  findById(id: number): Person | undefined;
  insert(person: CreatePersonDto): Person;
  update(id: number, patch: UpdatePersonDto): Person | undefined;
  remove(id: number): boolean;
}

export function createPeopleRepository(db: DatabaseSync): PeopleRepository {
  const findAllStmt = db.prepare('SELECT * FROM people ORDER BY id DESC');
  const findByIdStmt = db.prepare('SELECT * FROM people WHERE id = ?');
  const deleteStmt = db.prepare('DELETE FROM people WHERE id = ?');

  const insertStmt = db.prepare(`
    INSERT INTO people (
      title, first_name, last_name, gender, email, phone, age, date_of_birth,
      street_number, street_name, city, state, country, thumbnail_url, large_photo_url
    ) VALUES (
      @title, @firstName, @lastName, @gender, @email, @phone, @age, @dateOfBirth,
      @streetNumber, @streetName, @city, @state, @country, @thumbnailUrl, @largePhotoUrl
    )
  `);

  function findById(id: number): Person | undefined {
    const row = findByIdStmt.get(id) as unknown as PersonRow | undefined;
    return row ? rowToPerson(row) : undefined;
  }

  return {
    findAll() {
      return (findAllStmt.all() as unknown as PersonRow[]).map(rowToPerson);
    },

    findById,

    insert(person) {
      const info = insertStmt.run(person);
      return findById(Number(info.lastInsertRowid))!;
    },

    update(id, patch) {
      const fields = Object.keys(patch) as (keyof UpdatePersonDto)[];
      if (fields.length === 0) {
        return findById(id);
      }
      const setClause = fields
        .map((field) => `${PERSON_COLUMN_BY_FIELD[field]} = @${field}`)
        .join(', ');
      db.prepare(`UPDATE people SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({
        ...patch,
        id,
      });
      return findById(id);
    },

    remove(id) {
      const info = deleteStmt.run(id);
      return info.changes > 0;
    },
  };
}
