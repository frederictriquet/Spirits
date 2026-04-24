import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const typesSpiriteux = sqliteTable('types_spiritueux', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom').notNull().unique()
});

export const bouteilles = sqliteTable('bouteilles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom').notNull(),
	typeId: integer('type_id')
		.notNull()
		.references(() => typesSpiriteux.id),
	prixAchat: real('prix_achat').notNull(),
	degreAlcool: real('degre_alcool').notNull()
});
