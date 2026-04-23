import { describe, expect, it } from 'vitest';
import {
	getAllBouteilles,
	getBouteille,
	createBouteille,
	updateBouteille,
	deleteBouteille
} from '$lib/server/db/bouteilles';

describe('getAllBouteilles', () => {
	it('retourne un tableau non vide', () => {
		const bouteilles = getAllBouteilles();
		expect(bouteilles.length).toBeGreaterThan(0);
	});

	it('chaque bouteille a les champs obligatoires', () => {
		const bouteilles = getAllBouteilles();
		for (const b of bouteilles) {
			expect(typeof b.id).toBe('number');
			expect(typeof b.nom).toBe('string');
			expect(typeof b.type).toBe('string');
			expect(typeof b.prixAchat).toBe('number');
			expect(typeof b.degreAlcool).toBe('number');
		}
	});
});

describe('getBouteille', () => {
	it('retourne undefined pour un id inexistant', () => {
		expect(getBouteille(99999)).toBeUndefined();
	});

	it('retourne la bouteille pour un id valide', () => {
		const toutes = getAllBouteilles();
		const premiere = toutes[0];
		const trouvee = getBouteille(premiere.id);
		expect(trouvee).toBeDefined();
		expect(trouvee?.nom).toBe(premiere.nom);
	});
});

describe('createBouteille', () => {
	it("crée une bouteille et retourne l'entrée avec un id", () => {
		const data = { nom: 'Test Whisky', type: 'whisky', prixAchat: 50, degreAlcool: 43 };
		const bouteille = createBouteille(data);
		expect(typeof bouteille.id).toBe('number');
		expect(bouteille.nom).toBe(data.nom);
		expect(bouteille.prixAchat).toBe(data.prixAchat);
		deleteBouteille(bouteille.id); // nettoyage
	});
});

describe('updateBouteille', () => {
	it("met à jour les champs et retourne l'entrée mise à jour", () => {
		const created = createBouteille({ nom: 'Test', type: 'gin', prixAchat: 30, degreAlcool: 40 });
		const updated = updateBouteille(created.id, {
			nom: 'Test Modifié',
			type: 'gin',
			prixAchat: 35,
			degreAlcool: 40
		});
		expect(updated?.nom).toBe('Test Modifié');
		expect(updated?.prixAchat).toBe(35);
		deleteBouteille(created.id); // nettoyage
	});

	it('retourne undefined pour un id inexistant', () => {
		const result = updateBouteille(99999, {
			nom: 'X',
			type: 'gin',
			prixAchat: 30,
			degreAlcool: 40
		});
		expect(result).toBeUndefined();
	});
});

describe('deleteBouteille', () => {
	it('supprime la bouteille — getBouteille retourne ensuite undefined', () => {
		const created = createBouteille({
			nom: 'À Supprimer',
			type: 'vodka',
			prixAchat: 25,
			degreAlcool: 40
		});
		deleteBouteille(created.id);
		expect(getBouteille(created.id)).toBeUndefined();
	});
});
