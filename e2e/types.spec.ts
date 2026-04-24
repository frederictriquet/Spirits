import { test, expect } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';

// Types de référence (seedés) :
//   Whisky (utilisé par Ardbeg)    → suppression interdite
//   Rhum   (utilisé par Havana Club) → suppression interdite
//   Gin    (utilisé par Tanqueray) → suppression interdite
// Les tests de mutation créent leurs propres entrées (préfixe "E2E").

const DB_PATH = path.resolve(process.cwd(), 'data/test.db');

test.beforeAll(() => {
	const db = new Database(DB_PATH);
	db.exec('DELETE FROM bouteilles');
	db.exec('DELETE FROM types_spiritueux');

	const insertType = db.prepare('INSERT INTO types_spiritueux (nom) VALUES (?)');
	const whiskyId = insertType.run('Whisky').lastInsertRowid;
	const rhumId = insertType.run('Rhum').lastInsertRowid;
	const ginId = insertType.run('Gin').lastInsertRowid;
	insertType.run('Vodka');
	insertType.run('Tequila');
	insertType.run('Cognac');
	insertType.run('Armagnac');
	insertType.run('Eau-de-vie');
	insertType.run('Vin');

	const insertBouteille = db.prepare(
		'INSERT INTO bouteilles (nom, type_id, prix_achat, degre_alcool) VALUES (?, ?, ?, ?)'
	);
	insertBouteille.run('Ardbeg 10 ans', whiskyId, 55.0, 46);
	insertBouteille.run('Havana Club 7 ans', rhumId, 22.0, 40);
	insertBouteille.run('Tanqueray London Dry', ginId, 20.0, 43.1);
	db.close();
});

test.describe('Navigation — types', () => {
	test('un lien vers la gestion des types est visible sur la homepage', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Gérer les types' })).toBeVisible();
	});
});

test.describe('Liste des types', () => {
	test('affiche les types de référence dans un tableau', async ({ page }) => {
		await page.goto('/types');
		await expect(page.getByRole('heading', { name: /types/i })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Whisky' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Rhum' })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Gin' })).toBeVisible();
	});

	test('chaque type a un lien Modifier et un bouton Supprimer', async ({ page }) => {
		await page.goto('/types');
		const row = page.getByRole('row', { name: /Whisky/i });
		await expect(row.getByRole('link', { name: 'Modifier' })).toBeVisible();
		await expect(row.getByRole('button', { name: 'Supprimer' })).toBeVisible();
	});
});

test.describe('Créer un type', () => {
	test('formulaire visible à /types/new', async ({ page }) => {
		await page.goto('/types/new');
		await expect(page.getByLabel('Nom')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Ajouter' })).toBeVisible();
	});

	test('validation : nom vide affiche une erreur', async ({ page }) => {
		await page.goto('/types/new');
		await page.evaluate(() => {
			document.querySelectorAll('form [required]').forEach((el) => el.removeAttribute('required'));
		});
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await expect(page.locator('[role="alert"], .erreur')).toBeVisible();
	});

	test('crée et redirige vers la liste', async ({ page }) => {
		await page.goto('/types/new');
		await page.getByLabel('Nom').fill('E2E Saké Test');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await expect(page).toHaveURL('/types');
		await expect(page.getByRole('cell', { name: 'E2E Saké Test' })).toBeVisible();
	});
});

test.describe('Modifier un type', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/types/new');
		await page.getByLabel('Nom').fill('E2E Cidre Modifiable');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await page.waitForURL('/types');
	});

	test('pré-remplit le formulaire', async ({ page }) => {
		await page
			.getByRole('row', { name: /E2E Cidre Modifiable/i })
			.getByRole('link', { name: 'Modifier' })
			.click();
		await expect(page).toHaveURL(/\/types\/\d+\/edit/);
		await expect(page.getByLabel('Nom')).toHaveValue('E2E Cidre Modifiable');
	});

	test('modifie et redirige vers la liste', async ({ page }) => {
		await page
			.getByRole('row', { name: /E2E Cidre Modifiable/i })
			.getByRole('link', { name: 'Modifier' })
			.click();
		await page.getByLabel('Nom').clear();
		await page.getByLabel('Nom').fill('E2E Cidre Modifié');
		await page.getByRole('button', { name: 'Enregistrer' }).click();
		await expect(page).toHaveURL('/types');
		await expect(page.getByRole('cell', { name: 'E2E Cidre Modifié' })).toBeVisible();
	});
});

test.describe('Supprimer un type', () => {
	test('supprime un type non utilisé et revient à la liste', async ({ page }) => {
		await page.goto('/types/new');
		await page.getByLabel('Nom').fill('E2E À Supprimer');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await page.waitForURL('/types');

		page.on('dialog', (d) => d.accept());
		await page
			.getByRole('row', { name: /E2E À Supprimer/i })
			.getByRole('button', { name: 'Supprimer' })
			.click();
		await expect(page.getByRole('cell', { name: 'E2E À Supprimer' })).not.toBeVisible();
	});

	test('refuse de supprimer un type utilisé par une bouteille', async ({ page }) => {
		await page.goto('/types');
		page.on('dialog', (d) => d.accept());
		await page
			.getByRole('row', { name: /Whisky/i })
			.getByRole('button', { name: 'Supprimer' })
			.click();
		await expect(page.locator('[role="alert"], .erreur')).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Whisky' })).toBeVisible();
	});
});

test.describe('Intégration — sélecteur de type', () => {
	test('les types de la DB alimentent le select du formulaire de création de bouteille', async ({
		page
	}) => {
		await page.goto('/bouteilles/new');
		const select = page.getByLabel('Type');
		await expect(select.getByRole('option', { name: 'Whisky' })).toBeAttached();
		await expect(select.getByRole('option', { name: 'Rhum' })).toBeAttached();
		await expect(select.getByRole('option', { name: 'Gin' })).toBeAttached();
		await expect(select.getByRole('option', { name: 'Eau-de-vie' })).toBeAttached();
	});

	test('les types de la DB alimentent le filtre du tableau de la homepage', async ({ page }) => {
		await page.goto('/');
		const select = page.getByRole('columnheader', { name: 'Type' }).getByRole('combobox');
		await expect(select.getByRole('option', { name: 'Whisky' })).toBeAttached();
		await expect(select.getByRole('option', { name: 'Rhum' })).toBeAttached();
		await expect(select.getByRole('option', { name: 'Gin' })).toBeAttached();
	});
});
