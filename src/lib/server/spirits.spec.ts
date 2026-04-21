import { describe, expect, it } from 'vitest';
import { getAllSpirits } from './spirits';

describe('getAllSpirits', () => {
	it('retourne au moins un spiritueux', () => {
		expect(getAllSpirits().length).toBeGreaterThan(0);
	});

	it('garantit des identifiants uniques', () => {
		const ids = getAllSpirits().map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('retourne une collection immuable', () => {
		const spirits = getAllSpirits();
		expect(Object.isFrozen(spirits)).toBe(true);
	});
});
