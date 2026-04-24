import Database from 'better-sqlite3';

// Script de seed pour la DB de développement (data/spirits.db).
// Usage : npx vite-node src/lib/server/db/seed.ts

const sqlite = new Database(process.env.DB_PATH ?? 'data/spirits.db');

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

sqlite.exec('DELETE FROM bouteilles');
sqlite.exec('DELETE FROM types_spiritueux');

const insertType = sqlite.prepare('INSERT INTO types_spiritueux (nom) VALUES (?)');
const whiskyId = insertType.run('Whisky').lastInsertRowid;
const rhumId = insertType.run('Rhum').lastInsertRowid;
const ginId = insertType.run('Gin').lastInsertRowid;
const vodkaId = insertType.run('Vodka').lastInsertRowid;
const tequilaId = insertType.run('Tequila').lastInsertRowid;
const cognacId = insertType.run('Cognac').lastInsertRowid;
insertType.run('Armagnac');
insertType.run('Eau-de-vie');
insertType.run('Vin');

const insertBouteille = sqlite.prepare(
	'INSERT INTO bouteilles (nom, type_id, prix_achat, degre_alcool) VALUES (?, ?, ?, ?)'
);
insertBouteille.run('Ardbeg 10 ans', whiskyId, 55.0, 46);
insertBouteille.run('Hennessy VS', cognacId, 38.0, 40);
insertBouteille.run('Havana Club 7 ans', rhumId, 22.0, 40);
insertBouteille.run('Tanqueray London Dry', ginId, 20.0, 43.1);
insertBouteille.run('Patrón Silver', tequilaId, 45.0, 40);
insertBouteille.run('Grey Goose', vodkaId, 35.0, 40);
insertBouteille.run('Lagavulin 16 ans', whiskyId, 85.0, 43);
insertBouteille.run('Rémy Martin XO', cognacId, 180.0, 40);
insertBouteille.run('Diplomático Reserva Exclusiva', rhumId, 42.0, 40);
insertBouteille.run("Hendrick's", ginId, 38.0, 41.4);

sqlite.close();
console.log('Seed terminé.');
