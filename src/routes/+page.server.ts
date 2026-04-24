import type { PageServerLoad } from './$types';
import { getAllBouteilles } from '$lib/server/db/bouteilles';
import { getAllTypes } from '$lib/server/db/types';

export const load: PageServerLoad = () => {
	return {
		bouteilles: getAllBouteilles(),
		types: getAllTypes()
	};
};
