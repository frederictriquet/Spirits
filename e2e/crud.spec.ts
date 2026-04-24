import { test, expect } from '@playwright/test';

test.describe('Créer une bouteille', () => {
	test('formulaire visible', async ({ page }) => {
		await page.goto('/bouteilles/new');
		await expect(page.getByLabel('Nom')).toBeVisible();
		await expect(page.getByLabel('Type')).toBeVisible();
		await expect(page.getByLabel("Prix d'achat (€)")).toBeVisible();
		await expect(page.getByLabel("Degré d'alcool (%)")).toBeVisible();
	});

	test('validation : nom vide affiche une erreur', async ({ page }) => {
		await page.goto('/bouteilles/new');
		// Contourne la validation HTML native sur tous les champs requis pour atteindre le serveur.
		await page.evaluate(() => {
			document.querySelectorAll('form [required]').forEach((el) => el.removeAttribute('required'));
		});
		// Renseigne tout sauf le nom pour isoler la validation serveur du nom.
		await page.getByLabel('Type').selectOption('whisky');
		await page.getByLabel("Prix d'achat (€)").fill('30');
		await page.getByLabel("Degré d'alcool (%)").fill('40');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await expect(page.locator('[role="alert"], .erreur')).toBeVisible();
	});

	test('crée et redirige vers le détail', async ({ page }) => {
		await page.goto('/bouteilles/new');
		await page.getByLabel('Nom').fill('E2E Calvados Test');
		await page.getByLabel('Type').selectOption('eau-de-vie');
		await page.getByLabel("Prix d'achat (€)").fill('45');
		await page.getByLabel("Degré d'alcool (%)").fill('40');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await expect(page).toHaveURL(/\/spiritueux\/\d+/);
		await expect(page.getByRole('heading', { name: 'E2E Calvados Test' })).toBeVisible();
	});
});

test.describe('Modifier une bouteille', () => {
	let id: number;

	test.beforeEach(async ({ page }) => {
		await page.goto('/bouteilles/new');
		await page.getByLabel('Nom').fill('E2E Gin Modifiable');
		await page.getByLabel('Type').selectOption('gin');
		await page.getByLabel("Prix d'achat (€)").fill('28');
		await page.getByLabel("Degré d'alcool (%)").fill('44');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await page.waitForURL(/\/spiritueux\/\d+/);
		id = parseInt(page.url().match(/\/spiritueux\/(\d+)/)![1]);
	});

	test('pré-remplit le formulaire', async ({ page }) => {
		await page.goto(`/bouteilles/${id}/edit`);
		await expect(page.getByLabel('Nom')).toHaveValue('E2E Gin Modifiable');
		await expect(page.getByLabel('Type')).toHaveValue('gin');
		await expect(page.getByLabel("Prix d'achat (€)")).toHaveValue('28');
		await expect(page.getByLabel("Degré d'alcool (%)")).toHaveValue('44');
	});

	test('modifie et redirige vers le détail', async ({ page }) => {
		await page.goto(`/bouteilles/${id}/edit`);
		await page.getByLabel('Nom').clear();
		await page.getByLabel('Nom').fill('E2E Gin Modifié');
		await page.getByRole('button', { name: 'Enregistrer' }).click();
		await expect(page).toHaveURL(`/spiritueux/${id}`);
		await expect(page.getByRole('heading', { name: 'E2E Gin Modifié' })).toBeVisible();
	});
});

test.describe('Créer depuis la liste', () => {
	test('un lien "Ajouter une bouteille" est visible sur la homepage', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Ajouter une bouteille' })).toBeVisible();
	});

	test('créer depuis la liste ajoute la bouteille au tableau', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Ajouter une bouteille' }).click();
		await expect(page).toHaveURL('/bouteilles/new');
		await page.getByLabel('Nom').fill('E2E Mezcal Nuevo');
		await page.getByLabel('Type').selectOption('eau-de-vie');
		await page.getByLabel("Prix d'achat (€)").fill('55');
		await page.getByLabel("Degré d'alcool (%)").fill('45');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await expect(page).toHaveURL(/\/spiritueux\/\d+/);
		await page.getByRole('link', { name: '← Ma cave' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('cell', { name: 'E2E Mezcal Nuevo' })).toBeVisible();
	});
});

test.describe('Supprimer une bouteille', () => {
	test('supprime et revient à la liste', async ({ page }) => {
		await page.goto('/bouteilles/new');
		await page.getByLabel('Nom').fill('E2E À Supprimer');
		await page.getByLabel('Type').selectOption('vodka');
		await page.getByLabel("Prix d'achat (€)").fill('20');
		await page.getByLabel("Degré d'alcool (%)").fill('40');
		await page.getByRole('button', { name: 'Ajouter' }).click();
		await page.waitForURL(/\/spiritueux\/\d+/);

		// Accepte le confirm() natif avant de cliquer sur Supprimer.
		page.on('dialog', (d) => d.accept());
		await page.getByRole('button', { name: 'Supprimer' }).click();

		await expect(page).toHaveURL('/');
		await expect(page.getByText('E2E À Supprimer')).not.toBeVisible();
	});
});
