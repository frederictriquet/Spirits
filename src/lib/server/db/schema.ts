import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Schéma de la table principale des bouteilles de la cave.
export const bouteilles = sqliteTable('bouteilles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom').notNull(),
	type: text('type').notNull(),
	prixAchat: real('prix_achat').notNull(),
	degreAlcool: real('degre_alcool').notNull()
});
