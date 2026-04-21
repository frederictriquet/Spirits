import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

// Store réactif du thème, basé sur les runes Svelte 5.
// L'état initial provient de `data-theme` sur <html>, déjà positionné
// par le script inline dans `app.html` (évite le flash au chargement).
class ThemeStore {
	current: Theme = $state('light');

	constructor() {
		if (browser) {
			this.current = (document.documentElement.dataset.theme as Theme) ?? 'light';
		}
	}

	set(value: Theme): void {
		this.current = value;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, value);
			document.documentElement.dataset.theme = value;
		}
	}

	toggle(): void {
		this.set(this.current === 'light' ? 'dark' : 'light');
	}
}

export const theme = new ThemeStore();
