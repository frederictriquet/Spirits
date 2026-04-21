import { error } from '@sveltejs/kit';
import { trouverSpiritueux } from '$lib/data/spiritueux';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const spiritueux = trouverSpiritueux(params.id);
	if (!spiritueux) {
		error(404, 'Spiritueux introuvable');
	}
	return { spiritueux };
};
