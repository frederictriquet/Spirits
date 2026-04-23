import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import { getBouteille, updateBouteille } from '$lib/server/db/bouteilles';
import { bouteilleSchema } from '$lib/server/validation/bouteille';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) error(404, 'Bouteille introuvable');
	const bouteille = getBouteille(id);
	if (!bouteille) error(404, 'Bouteille introuvable');
	return { bouteille };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) return fail(400, { erreur: 'ID invalide.' });

		const data = await request.formData();

		const result = bouteilleSchema.safeParse({
			nom: data.get('nom'),
			type: data.get('type'),
			prixAchat: data.get('prixAchat'),
			degreAlcool: data.get('degreAlcool')
		});

		if (!result.success) {
			return fail(400, { erreur: result.error.issues[0].message });
		}

		try {
			updateBouteille(id, result.data);
			redirect(303, `/spiritueux/${id}`);
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(500, { erreur: 'Une erreur est survenue. Réessaie.' });
		}
	}
};
