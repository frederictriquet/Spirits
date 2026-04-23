import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { createBouteille } from '$lib/server/db/bouteilles';
import { bouteilleSchema } from '$lib/server/validation/bouteille';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
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
			const bouteille = createBouteille(result.data);
			redirect(303, `/spiritueux/${bouteille.id}`);
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(500, { erreur: 'Une erreur est survenue. Réessaie.' });
		}
	}
};
