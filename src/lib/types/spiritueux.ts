export type TypeSpiritueux =
	| 'whisky'
	| 'rhum'
	| 'gin'
	| 'vodka'
	| 'tequila'
	| 'cognac'
	| 'armagnac'
	| 'eau-de-vie';

export type DegreAlcool = number & { readonly __brand: 'DegreAlcool' };

export interface Spiritueux {
	id: string;
	nom: string;
	degreAlcool: DegreAlcool;
	type: TypeSpiritueux;
}

// Valide et construit un degré d'alcool (0 < degré ≤ 100).
export function degreAlcool(valeur: number): DegreAlcool {
	if (!Number.isFinite(valeur) || valeur <= 0 || valeur > 100) {
		throw new RangeError(
			`Degré d'alcool invalide : ${valeur} (attendu dans ]0, 100])`
		);
	}
	return valeur as DegreAlcool;
}
