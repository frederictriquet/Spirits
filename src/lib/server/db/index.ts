import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Singleton — une seule connexion partagée par process.
// Chemin configurable via DB_PATH pour les tests E2E (défaut : data/spirits.db).
const dbPath = process.env.DB_PATH ?? 'data/spirits.db';
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Crée les tables si elles n'existent pas encore (dev + test)
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS types_spiritueux (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL UNIQUE
    )
`);
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS bouteilles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        type_id INTEGER NOT NULL REFERENCES types_spiritueux(id),
        prix_achat REAL NOT NULL,
        degre_alcool REAL NOT NULL
    )
`);
