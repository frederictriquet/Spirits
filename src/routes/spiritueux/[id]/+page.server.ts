import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getBouteille, deleteBouteille } from '$lib/server/db/bouteilles';

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) error(404, 'Spiritueux introuvable');
	const bouteille = getBouteille(id);
	if (!bouteille) error(404, 'Spiritueux introuvable');
	return { bouteille };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) error(400, 'ID invalide');
		deleteBouteille(id);
		redirect(303, '/');
	}
};
