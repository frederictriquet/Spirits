import { db } from './index';
import { typesSpiriteux, bouteilles } from './schema';
import { eq, count } from 'drizzle-orm';

export function getAllTypes() {
	return db.select().from(typesSpiriteux).orderBy(typesSpiriteux.nom).all();
}

export function getType(id: number) {
	return db.select().from(typesSpiriteux).where(eq(typesSpiriteux.id, id)).get();
}

export function createType(nom: string) {
	return db.insert(typesSpiriteux).values({ nom }).returning().get();
}

export function updateType(id: number, nom: string) {
	return db.update(typesSpiriteux).set({ nom }).where(eq(typesSpiriteux.id, id)).returning().get();
}

export function isTypeUsed(id: number): boolean {
	const result = db.select({ n: count() }).from(bouteilles).where(eq(bouteilles.typeId, id)).get();
	return (result?.n ?? 0) > 0;
}

export function deleteType(id: number) {
	db.delete(typesSpiriteux).where(eq(typesSpiriteux.id, id)).run();
}
