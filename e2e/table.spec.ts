import { test, expect } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';

// Données de référence insérées par le beforeAll ci-dessous :
// 1. Ardbeg 10 ans     | Whisky | 55 € | 46 %
// 2. Havana Club 7 ans | Rhum   | 22 € | 40 %
// 3. Tanqueray London  | Gin    | 20 € | 43.1 %

const DB_PATH = path.resolve(process.cwd(), 'data/test.db');

test.beforeAll(() => {
	const db = new Database(DB_PATH);
	db.exec('DELETE FROM bouteilles');

	// Les types de référence existent déjà (seedés par global-setup).
	const whisky = db.prepare("SELECT id FROM types_spiritueux WHERE nom = 'Whisky'").get() as {
		id: number;
	};
	const rhum = db.prepare("SELECT id FROM types_spiritueux WHERE nom = 'Rhum'").get() as {
		id: number;
	};
	const gin = db.prepare("SELECT id FROM types_spiritueux WHERE nom = 'Gin'").get() as {
		id: number;
	};

	const insert = db.prepare(
		'INSERT INTO bouteilles (nom, type_id, prix_achat, degre_alcool) VALUES (?, ?, ?, ?)'
	);
	insert.run('Ardbeg 10 ans', whisky.id, 55.0, 46);
	insert.run('Havana Club 7 ans', rhum.id, 22.0, 40);
	insert.run('Tanqueray London Dry', gin.id, 20.0, 43.1);
	db.close();
});

test.describe('Tableau — structure', () => {
	test('affiche un tableau avec les bonnes colonnes', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('table')).toBeVisible();
		await expect(page.getByRole('columnheader', { name: 'Nom' })).toBeVisible();
		await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
		await expect(page.getByRole('columnheader', { name: /Prix/ })).toBeVisible();
		await expect(page.getByRole('columnheader', { name: /Degré/ })).toBeVisible();
	});

	test('affiche les 3 bouteilles de référence dans le tableau', async ({ page }) => {
		await page.goto('/');
		const lignes = page.getByRole('row');
		// 1 ligne d'en-tête + 3 lignes de données = 4 lignes minimum
		await expect(lignes).toHaveCount(4);
		await expect(page.getByRole('cell', { name: 'Ardbeg 10 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Havana Club 7 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Tanqueray London Dry' })).toBeVisible();
	});

	test('chaque ligne est un lien cliquable vers le détail', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('cell', { name: 'Ardbeg 10 ans' }).click();
		await expect(page).toHaveURL(/\/spiritueux\/\d+/);
	});
});

test.describe('Tableau — tri', () => {
	test('tri par Nom : ordre alphabétique croissant par défaut ou au premier clic', async ({
		page
	}) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: 'Nom' }).click();
		const lignes = page.getByRole('row');
		// Ardbeg < Havana < Tanqueray
		await expect(lignes.nth(1)).toContainText('Ardbeg 10 ans');
		await expect(lignes.nth(2)).toContainText('Havana Club 7 ans');
		await expect(lignes.nth(3)).toContainText('Tanqueray London Dry');
	});

	test("tri par Nom : deuxième clic inverse l'ordre (décroissant)", async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: 'Nom' }).click();
		await page.getByRole('columnheader', { name: 'Nom' }).click();
		const lignes = page.getByRole('row');
		await expect(lignes.nth(1)).toContainText('Tanqueray London Dry');
		await expect(lignes.nth(3)).toContainText('Ardbeg 10 ans');
	});

	test('tri par Prix croissant : Tanqueray (20) < Havana (22) < Ardbeg (55)', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: /Prix/ }).click();
		const lignes = page.getByRole('row');
		await expect(lignes.nth(1)).toContainText('Tanqueray London Dry');
		await expect(lignes.nth(2)).toContainText('Havana Club 7 ans');
		await expect(lignes.nth(3)).toContainText('Ardbeg 10 ans');
	});

	test('tri par Degré croissant : Havana (40) < Tanqueray (43.1) < Ardbeg (46)', async ({
		page
	}) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: /Degré/ }).click();
		const lignes = page.getByRole('row');
		await expect(lignes.nth(1)).toContainText('Havana Club 7 ans');
		await expect(lignes.nth(2)).toContainText('Tanqueray London Dry');
		await expect(lignes.nth(3)).toContainText('Ardbeg 10 ans');
	});
});

test.describe('Tableau — filtres', () => {
	test('filtre par Nom : saisir "ardbeg" n\'affiche que l\'Ardbeg', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: 'Nom' }).getByRole('textbox').fill('ardbeg');
		await expect(page.getByRole('row')).toHaveCount(2); // 1 header + 1 résultat
		await expect(page.getByRole('cell', { name: 'Ardbeg 10 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Havana Club 7 ans' })).not.toBeVisible();
	});

	test('filtre par Type : sélectionner "Rhum" n\'affiche que le Havana Club', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('columnheader', { name: 'Type' })
			.getByRole('combobox')
			.selectOption({ label: 'Rhum' });
		await expect(page.getByRole('row')).toHaveCount(2);
		await expect(page.getByRole('cell', { name: 'Havana Club 7 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Ardbeg 10 ans' })).not.toBeVisible();
	});

	test('filtre par Prix min : entrer 30 exclut Havana (22) et Tanqueray (20)', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: /Prix/ }).getByRole('spinbutton').fill('30');
		await expect(page.getByRole('row')).toHaveCount(2);
		await expect(page.getByRole('cell', { name: 'Ardbeg 10 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Havana Club 7 ans' })).not.toBeVisible();
	});

	test("filtre par Degré min : entrer 44 n'affiche que l'Ardbeg (46)", async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: /Degré/ }).getByRole('spinbutton').fill('44');
		await expect(page.getByRole('row')).toHaveCount(2);
		await expect(page.getByRole('cell', { name: 'Ardbeg 10 ans' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Tanqueray London Dry' })).not.toBeVisible();
	});

	test('les filtres se cumulent : Type Gin + Prix min 25 → aucun résultat', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('columnheader', { name: 'Type' })
			.getByRole('combobox')
			.selectOption({ label: 'Gin' });
		await page.getByRole('columnheader', { name: /Prix/ }).getByRole('spinbutton').fill('25');
		// Tanqueray est Gin à 20 € — exclu par prix min 25
		await expect(page.getByRole('row')).toHaveCount(1); // uniquement l'en-tête
	});

	test('vider un filtre restaure toutes les lignes', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('columnheader', { name: 'Nom' }).getByRole('textbox').fill('ardbeg');
		await expect(page.getByRole('row')).toHaveCount(2);
		await page.getByRole('columnheader', { name: 'Nom' }).getByRole('textbox').clear();
		await expect(page.getByRole('row')).toHaveCount(4);
	});
});
