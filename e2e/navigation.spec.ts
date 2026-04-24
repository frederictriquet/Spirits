import { test, expect } from '@playwright/test';
import Database from 'better-sqlite3';

// Identifiants récupérés depuis la DB de test avant l'exécution des tests
let bouteillId: number;
let typeId: number;

test.beforeAll(async () => {
	// Récupérer un id de bouteille et de type depuis la DB de test
	const db = new Database('data/test.db');
	const b = db.prepare('SELECT id FROM bouteilles LIMIT 1').get() as { id: number };
	bouteillId = b.id;
	const t = db.prepare('SELECT id FROM types_spiritueux LIMIT 1').get() as { id: number };
	typeId = t.id;
	db.close();
});

// 1. Homepage → /types
test('homepage → /types : clic "Gérer les types"', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Gérer les types' }).click();
	await expect(page).toHaveURL('/types');
});

// 2. Homepage → /bouteilles/new
test('homepage → /bouteilles/new : clic "Ajouter une bouteille"', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Ajouter une bouteille' }).click();
	await expect(page).toHaveURL('/bouteilles/new');
});

// 3. Homepage → /spiritueux/[id] : clic sur une ligne du tableau
test('homepage → /spiritueux/[id] : clic sur une ligne du tableau', async ({ page }) => {
	await page.goto('/');
	// Clic sur la première ligne du tableau (balise tr dans tbody)
	await page.locator('tbody tr').first().click();
	await expect(page).toHaveURL(`/spiritueux/${bouteillId}`);
});

// 4. /types → /types/new : clic "Ajouter un type"
test('/types → /types/new : clic "Ajouter un type"', async ({ page }) => {
	await page.goto('/types');
	await page.getByRole('link', { name: 'Ajouter un type' }).click();
	await expect(page).toHaveURL('/types/new');
});

// 5. /types → /types/[id]/edit : clic "Modifier" sur le premier type
test('/types → /types/[id]/edit : clic "Modifier" sur le premier type', async ({ page }) => {
	await page.goto('/types');
	await page.getByRole('link', { name: 'Modifier' }).first().click();
	await expect(page).toHaveURL(`/types/${typeId}/edit`);
});

// 6. /types → / : lien retour vers homepage
test('/types → / : lien retour vers homepage', async ({ page }) => {
	await page.goto('/types');
	await page.getByRole('link', { name: '← Ma cave' }).click();
	await expect(page).toHaveURL('/');
});

// 7. /types/new → /types : lien "Annuler"
test('/types/new → /types : clic "Annuler"', async ({ page }) => {
	await page.goto('/types/new');
	await page.getByRole('link', { name: 'Annuler' }).click();
	await expect(page).toHaveURL('/types');
});

// 8. /types/[id]/edit → /types : lien "Annuler"
test('/types/[id]/edit → /types : clic "Annuler"', async ({ page }) => {
	await page.goto(`/types/${typeId}/edit`);
	await page.getByRole('link', { name: 'Annuler' }).click();
	await expect(page).toHaveURL('/types');
});

// 9. /bouteilles/new → / : lien "Annuler"
test('/bouteilles/new → / : clic "Annuler"', async ({ page }) => {
	await page.goto('/bouteilles/new');
	await page.getByRole('link', { name: 'Annuler' }).click();
	await expect(page).toHaveURL('/');
});

// 10. /bouteilles/[id]/edit → /spiritueux/[id] : lien "Annuler"
test('/bouteilles/[id]/edit → /spiritueux/[id] : clic "Annuler"', async ({ page }) => {
	await page.goto(`/bouteilles/${bouteillId}/edit`);
	await page.getByRole('link', { name: 'Annuler' }).click();
	await expect(page).toHaveURL(`/spiritueux/${bouteillId}`);
});

// 11. /spiritueux/[id] → /bouteilles/[id]/edit : clic "Modifier"
test('/spiritueux/[id] → /bouteilles/[id]/edit : clic "Modifier"', async ({ page }) => {
	await page.goto(`/spiritueux/${bouteillId}`);
	await page.getByRole('link', { name: 'Modifier' }).click();
	await expect(page).toHaveURL(`/bouteilles/${bouteillId}/edit`);
});

// 12. /spiritueux/[id] → / : lien "← Ma cave"
test('/spiritueux/[id] → / : clic "← Ma cave"', async ({ page }) => {
	await page.goto(`/spiritueux/${bouteillId}`);
	await page.getByRole('link', { name: '← Ma cave' }).click();
	await expect(page).toHaveURL('/');
});
