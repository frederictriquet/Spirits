import type { PageServerLoad } from './$types';
import { getAllBouteilles } from '$lib/server/db/bouteilles';

export const load: PageServerLoad = () => {
	return { bouteilles: getAllBouteilles() };
};
