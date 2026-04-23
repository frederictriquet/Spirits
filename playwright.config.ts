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
		command: 'tsx e2e/global-setup.ts && DB_PATH=data/test.db vite dev --port 5174',
		url: 'http://localhost:5174',
		reuseExistingServer: !process.env.CI,
		env: { DB_PATH: 'data/test.db' }
	}
});
