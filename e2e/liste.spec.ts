import { test, expect } from '@playwright/test';

test.describe('Page liste', () => {
	test('affiche le titre "Ma cave"', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Ma cave' })).toBeVisible();
	});

	test('affiche les bouteilles de référence', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Ardbeg 10 ans')).toBeVisible();
		await expect(page.getByText('Havana Club 7 ans')).toBeVisible();
		await expect(page.getByText('Tanqueray London Dry')).toBeVisible();
	});

	test('cliquer sur une carte navigue vers le détail', async ({ page }) => {
		await page.goto('/');
		await page.getByText('Ardbeg 10 ans').click();
		await expect(page).toHaveURL(/\/spiritueux\/\d+/);
		await expect(page.getByRole('heading', { name: 'Ardbeg 10 ans' })).toBeVisible();
	});

	test('le lien "← Ma cave" depuis le détail revient à la homepage', async ({ page }) => {
		await page.goto('/');
		await page.getByText('Ardbeg 10 ans').click();
		await page.getByRole('link', { name: '← Ma cave' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'Ma cave' })).toBeVisible();
	});
});
