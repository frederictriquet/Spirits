import Database from 'better-sqlite3';

// Initialise la DB de test : schéma + 3 bouteilles de référence.
// Exécuté en CLI via le webServer Playwright AVANT le démarrage de Vite,
// car Playwright lance globalSetup et webServer en parallèle (pas séquentiel).
function setup() {
	const sqlite = new Database('data/test.db');

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS bouteilles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			nom TEXT NOT NULL,
			type TEXT NOT NULL,
			prix_achat REAL NOT NULL,
			degre_alcool REAL NOT NULL
		)
	`);

	sqlite.exec('DELETE FROM bouteilles');

	const insert = sqlite.prepare(
		'INSERT INTO bouteilles (nom, type, prix_achat, degre_alcool) VALUES (?, ?, ?, ?)'
	);
	insert.run('Ardbeg 10 ans', 'whisky', 55.0, 46);
	insert.run('Havana Club 7 ans', 'rhum', 22.0, 40);
	insert.run('Tanqueray London Dry', 'gin', 20.0, 43.1);

	sqlite.close();
}

setup();

export default async function globalSetup() {
	setup();
}
