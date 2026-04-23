import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Singleton — une seule connexion partagée par process.
// Chemin configurable via DB_PATH pour les tests E2E (défaut : data/spirits.db).
const dbPath = process.env.DB_PATH ?? 'data/spirits.db';
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
