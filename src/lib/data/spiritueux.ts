import { degreAlcool, type Spiritueux } from '$lib/types/spiritueux';

// Catalogue en mémoire — à remplacer par une source persistante.
const CATALOGUE: readonly Spiritueux[] = [
	{
		id: 'lagavulin-16',
		nom: 'Lagavulin 16 ans',
		degreAlcool: degreAlcool(43),
		type: 'whisky'
	},
	{
		id: 'diplomatico-reserva',
		nom: 'Diplomático Reserva Exclusiva',
		degreAlcool: degreAlcool(40),
		type: 'rhum'
	},
	{
		id: 'hendricks',
		nom: "Hendrick's",
		degreAlcool: degreAlcool(41.4),
		type: 'gin'
	}
];

export function trouverSpiritueux(id: string): Spiritueux | undefined {
	return CATALOGUE.find((s) => s.id === id);
}

export function listerSpiritueux(): readonly Spiritueux[] {
	return CATALOGUE;
}
