import { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync | undefined;

export function getDb(dbPath = process.env.DB_PATH ?? 'finq.db'): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(dbPath);
  }
  return db;
}

export function closeDb(): void {
  db?.close();
  db = undefined;
}
