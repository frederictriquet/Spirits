import { z } from 'zod';

export const bouteilleSchema = z.object({
	nom: z.string().trim().min(1, 'Le nom est requis.'),
	typeId: z.coerce.number().int().positive('Le type est requis.'),
	prixAchat: z.coerce.number().positive("Le prix d'achat doit être un nombre positif."),
	degreAlcool: z.coerce
		.number()
		.positive("Le degré d'alcool doit être entre 0 et 100.")
		.max(100, "Le degré d'alcool doit être entre 0 et 100.")
});
