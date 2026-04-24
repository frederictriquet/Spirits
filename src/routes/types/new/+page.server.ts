import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createType } from '$lib/server/db/types';
import { z } from 'zod';

const typeSchema = z.object({
	nom: z.string().trim().min(1, 'Le nom est requis.')
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const result = typeSchema.safeParse({ nom: formData.get('nom') });
		if (!result.success) {
			return { erreur: result.error.issues[0].message };
		}
		try {
			createType(result.data.nom);
		} catch (err) {
			// Contrainte UNIQUE : le type existe déjà, on redirige quand même
			if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
				redirect(303, '/types');
			}
			throw err;
		}
		redirect(303, '/types');
	}
};
