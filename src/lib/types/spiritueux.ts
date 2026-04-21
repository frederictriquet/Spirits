export type TypeSpiritueux =
	| 'whisky'
	| 'rhum'
	| 'gin'
	| 'vodka'
	| 'tequila'
	| 'cognac'
	| 'vin rouge'
	| 'vin blanc'
	| 'vin rosé';

export interface Spiritueux {
	nom: string;
	degreAlcool: number;
	type: TypeSpiritueux;
}
