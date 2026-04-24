import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getType, updateType } from '$lib/server/db/types';
import { z } from 'zod';

const typeSchema = z.object({
	nom: z.string().trim().min(1, 'Le nom est requis.')
});

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) error(404, 'Type introuvable');
	const type = getType(id);
	if (!type) error(404, 'Type introuvable');
	return { type };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) error(400, 'ID invalide');
		const formData = await request.formData();
		const result = typeSchema.safeParse({ nom: formData.get('nom') });
		if (!result.success) {
			return { erreur: result.error.issues[0].message };
		}
		updateType(id, result.data.nom);
		redirect(303, '/types');
	}
};
