import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import {
	getAllBouteilles,
	getBouteille,
	createBouteille,
	updateBouteille,
	deleteBouteille
} from '$lib/server/db/bouteilles';
import { db } from '$lib/server/db/index';
import { typesSpiriteux } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

let testTypeId: number;

beforeAll(() => {
	const t = db.insert(typesSpiriteux).values({ nom: 'Test Type Spec' }).returning().get();
	testTypeId = t.id;
});

afterAll(() => {
	db.delete(typesSpiriteux).where(eq(typesSpiriteux.id, testTypeId)).run();
});

describe('getAllBouteilles', () => {
	it('retourne un tableau', () => {
		expect(Array.isArray(getAllBouteilles())).toBe(true);
	});

	it('chaque bouteille a les champs obligatoires', () => {
		const created = createBouteille({
			nom: 'Spec Whisky',
			typeId: testTypeId,
			prixAchat: 50,
			degreAlcool: 43
		});
		const bouteilles = getAllBouteilles();
		const found = bouteilles.find((b) => b.id === created.id);
		expect(found).toBeDefined();
		expect(typeof found!.id).toBe('number');
		expect(typeof found!.nom).toBe('string');
		expect(typeof found!.type).toBe('string');
		expect(typeof found!.typeId).toBe('number');
		expect(typeof found!.prixAchat).toBe('number');
		expect(typeof found!.degreAlcool).toBe('number');
		deleteBouteille(created.id);
	});
});

describe('getBouteille', () => {
	it('retourne undefined pour un id inexistant', () => {
		expect(getBouteille(99999)).toBeUndefined();
	});

	it('retourne la bouteille pour un id valide', () => {
		const created = createBouteille({
			nom: 'Spec Get',
			typeId: testTypeId,
			prixAchat: 30,
			degreAlcool: 40
		});
		const trouvee = getBouteille(created.id);
		expect(trouvee).toBeDefined();
		expect(trouvee?.nom).toBe('Spec Get');
		deleteBouteille(created.id);
	});
});

describe('createBouteille', () => {
	it("crée une bouteille et retourne l'entrée avec un id", () => {
		const bouteille = createBouteille({
			nom: 'Test Whisky',
			typeId: testTypeId,
			prixAchat: 50,
			degreAlcool: 43
		});
		expect(typeof bouteille.id).toBe('number');
		expect(bouteille.nom).toBe('Test Whisky');
		expect(bouteille.prixAchat).toBe(50);
		deleteBouteille(bouteille.id);
	});
});

describe('updateBouteille', () => {
	it("met à jour les champs et retourne l'entrée mise à jour", () => {
		const created = createBouteille({
			nom: 'Test',
			typeId: testTypeId,
			prixAchat: 30,
			degreAlcool: 40
		});
		const updated = updateBouteille(created.id, {
			nom: 'Test Modifié',
			typeId: testTypeId,
			prixAchat: 35,
			degreAlcool: 40
		});
		expect(updated?.nom).toBe('Test Modifié');
		expect(updated?.prixAchat).toBe(35);
		deleteBouteille(created.id);
	});

	it('retourne undefined pour un id inexistant', () => {
		const result = updateBouteille(99999, {
			nom: 'X',
			typeId: testTypeId,
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
			typeId: testTypeId,
			prixAchat: 25,
			degreAlcool: 40
		});
		deleteBouteille(created.id);
		expect(getBouteille(created.id)).toBeUndefined();
	});
});
