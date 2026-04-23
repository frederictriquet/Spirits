import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '../src/lib/server/db/index';

migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations appliquées.');
