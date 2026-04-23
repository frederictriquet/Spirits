import { eq } from 'drizzle-orm';
import { db } from './index';
import { bouteilles } from './schema';

export type Bouteille = typeof bouteilles.$inferSelect;

export function getAllBouteilles(): Bouteille[] {
	return db.select().from(bouteilles).all();
}

export function getBouteille(id: number): Bouteille | undefined {
	return db.select().from(bouteilles).where(eq(bouteilles.id, id)).get();
}

// Insère une nouvelle bouteille et retourne l'entrée créée.
export function createBouteille(data: Omit<Bouteille, 'id'>): Bouteille {
	return db.insert(bouteilles).values(data).returning().get()!;
}

// Met à jour une bouteille existante et retourne l'entrée mise à jour.
export function updateBouteille(id: number, data: Omit<Bouteille, 'id'>): Bouteille | undefined {
	return db.update(bouteilles).set(data).where(eq(bouteilles.id, id)).returning().get();
}

// Supprime une bouteille par son identifiant.
export function deleteBouteille(id: number): void {
	db.delete(bouteilles).where(eq(bouteilles.id, id)).run();
}
