import { z } from 'zod';

const TYPES = [
	'whisky',
	'rhum',
	'gin',
	'vodka',
	'tequila',
	'cognac',
	'armagnac',
	'eau-de-vie',
	'vin'
] as const;

export const bouteilleSchema = z.object({
	nom: z.string().trim().min(1, 'Le nom est requis.'),
	type: z.enum(TYPES, { error: () => 'Le type est invalide.' }),
	prixAchat: z.coerce.number().positive("Le prix d'achat doit être un nombre positif."),
	degreAlcool: z.coerce
		.number()
		.positive("Le degré d'alcool doit être entre 0 et 100.")
		.max(100, "Le degré d'alcool doit être entre 0 et 100.")
});
