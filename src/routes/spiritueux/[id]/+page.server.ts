import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSpiritById } from '$lib/server/spirits';

export const load: PageServerLoad = ({ params }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) {
		error(404, 'Spiritueux introuvable');
	}
	const spirit = getSpiritById(id);
	if (!spirit) {
		error(404, 'Spiritueux introuvable');
	}
	return { spirit };
};
