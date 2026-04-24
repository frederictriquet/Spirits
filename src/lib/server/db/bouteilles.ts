import { db } from './index';
import { bouteilles, typesSpiriteux } from './schema';
import { eq } from 'drizzle-orm';

type BouteilleRow = {
	id: number;
	nom: string;
	type: string;
	typeId: number;
	prixAchat: number;
	degreAlcool: number;
};

function mapRow(row: {
	bouteilles: typeof bouteilles.$inferSelect;
	types_spiritueux: typeof typesSpiriteux.$inferSelect;
}): BouteilleRow {
	return {
		id: row.bouteilles.id,
		nom: row.bouteilles.nom,
		type: row.types_spiritueux.nom,
		typeId: row.bouteilles.typeId,
		prixAchat: row.bouteilles.prixAchat,
		degreAlcool: row.bouteilles.degreAlcool
	};
}

export function getAllBouteilles(): BouteilleRow[] {
	return db
		.select()
		.from(bouteilles)
		.innerJoin(typesSpiriteux, eq(bouteilles.typeId, typesSpiriteux.id))
		.all()
		.map(mapRow);
}

export function getBouteille(id: number): BouteilleRow | undefined {
	const row = db
		.select()
		.from(bouteilles)
		.innerJoin(typesSpiriteux, eq(bouteilles.typeId, typesSpiriteux.id))
		.where(eq(bouteilles.id, id))
		.get();
	return row ? mapRow(row) : undefined;
}

export function createBouteille(data: {
	nom: string;
	typeId: number;
	prixAchat: number;
	degreAlcool: number;
}) {
	return db.insert(bouteilles).values(data).returning().get();
}

export function updateBouteille(
	id: number,
	data: { nom: string; typeId: number; prixAchat: number; degreAlcool: number }
) {
	return db.update(bouteilles).set(data).where(eq(bouteilles.id, id)).returning().get();
}

export function deleteBouteille(id: number) {
	db.delete(bouteilles).where(eq(bouteilles.id, id)).run();
}
