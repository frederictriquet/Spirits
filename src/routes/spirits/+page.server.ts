import type { PageServerLoad } from './$types';
import { getAllSpirits } from '$lib/server/spirits';

export const load: PageServerLoad = () => {
	return { spirits: getAllSpirits() };
};
