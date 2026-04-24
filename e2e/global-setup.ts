import Database from 'better-sqlite3';

// Initialise la DB de test : schéma + données de référence.
// Exécuté en CLI via le webServer Playwright AVANT le démarrage de Vite,
// car Playwright lance globalSetup et webServer en parallèle (pas séquentiel).
function setup() {
	const sqlite = new Database('data/test.db');

	// Recréer les tables depuis zéro pour garantir le bon schéma
	sqlite.exec('DROP TABLE IF EXISTS bouteilles');
	sqlite.exec('DROP TABLE IF EXISTS types_spiritueux');

	sqlite.exec(`
		CREATE TABLE types_spiritueux (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			nom TEXT NOT NULL UNIQUE
		)
	`);

	sqlite.exec(`
		CREATE TABLE bouteilles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			nom TEXT NOT NULL,
			type_id INTEGER NOT NULL REFERENCES types_spiritueux(id),
			prix_achat REAL NOT NULL,
			degre_alcool REAL NOT NULL
		)
	`);

	const insertType = sqlite.prepare('INSERT INTO types_spiritueux (nom) VALUES (?)');
	const whiskyId = insertType.run('Whisky').lastInsertRowid;
	const rhumId = insertType.run('Rhum').lastInsertRowid;
	const ginId = insertType.run('Gin').lastInsertRowid;
	insertType.run('Vodka');
	insertType.run('Tequila');
	insertType.run('Cognac');
	insertType.run('Armagnac');
	insertType.run('Eau-de-vie');
	insertType.run('Vin');

	const insertBouteille = sqlite.prepare(
		'INSERT INTO bouteilles (nom, type_id, prix_achat, degre_alcool) VALUES (?, ?, ?, ?)'
	);
	insertBouteille.run('Ardbeg 10 ans', whiskyId, 55.0, 46);
	insertBouteille.run('Havana Club 7 ans', rhumId, 22.0, 40);
	insertBouteille.run('Tanqueray London Dry', ginId, 20.0, 43.1);

	sqlite.close();
}

setup();

export default async function globalSetup() {
	setup();
}
