import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createBouteille } from '$lib/server/db/bouteilles';
import { getAllTypes } from '$lib/server/db/types';
import { bouteilleSchema } from '$lib/server/validation/bouteille';

export const load: PageServerLoad = () => {
	return { types: getAllTypes() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const result = bouteilleSchema.safeParse({
			nom: formData.get('nom'),
			typeId: formData.get('typeId'),
			prixAchat: formData.get('prixAchat'),
			degreAlcool: formData.get('degreAlcool')
		});
		if (!result.success) {
			return { erreur: result.error.issues[0].message };
		}
		const bouteille = createBouteille(result.data);
		redirect(303, `/spiritueux/${bouteille.id}`);
	}
};
