import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllTypes, deleteType, isTypeUsed } from '$lib/server/db/types';

export const load: PageServerLoad = () => {
	return { types: getAllTypes() };
};

export const actions: Actions = {
	delete: async ({ url }) => {
		const id = parseInt(url.searchParams.get('id') ?? '', 10);
		if (isNaN(id)) error(400, 'ID invalide');
		if (isTypeUsed(id)) {
			return { erreur: 'Ce type est utilisé par une ou plusieurs bouteilles.' };
		}
		deleteType(id);
		redirect(303, '/types');
	}
};
