import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getBouteille, updateBouteille } from '$lib/server/db/bouteilles';
import { getAllTypes } from '$lib/server/db/types';
import { bouteilleSchema } from '$lib/server/validation/bouteille';

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) error(404, 'Bouteille introuvable');
	const bouteille = getBouteille(id);
	if (!bouteille) error(404, 'Bouteille introuvable');
	const types = getAllTypes();
	return { bouteille, types };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) error(400, 'ID invalide');
		const formData = await request.formData();
		const result = bouteilleSchema.safeParse({
			nom: formData.get('nom'),
			typeId: formData.get('typeId'),
			prixAchat: formData.get('prixAchat'),
			degreAlcool: formData.get('degreAlcool')
		});
		if (!result.success) {
			const types = getAllTypes();
			return { erreur: result.error.issues[0].message, types };
		}
		updateBouteille(id, result.data);
		redirect(303, `/spiritueux/${id}`);
	}
};
