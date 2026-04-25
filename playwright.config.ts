import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: [['html', { open: 'never' }], ['line']],
	use: {
		baseURL: 'http://localhost:5174',
		trace: 'on-first-retry'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	globalSetup: './e2e/global-setup.ts',
	webServer: {
		// Initialise la DB de test AVANT de démarrer Vite (sinon Vite ouvre un fichier vide).
		// On build puis on lance preview pour éviter les délais d'hydratation dus aux modules
		// ESM non bundlés de vite dev, qui causent des échecs de test intermittents.
		command:
			'tsx e2e/global-setup.ts && DB_PATH=data/test.db vite build && DB_PATH=data/test.db vite preview --port 5174',
		url: 'http://localhost:5174',
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		env: { DB_PATH: 'data/test.db' }
	}
});
