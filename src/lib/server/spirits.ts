export type Spirit = {
	id: number;
	name: string;
	category: string;
	origin: string;
	abv: number;
};

// Données statiques en attendant une vraie base de données.
const spirits: Spirit[] = [
	{ id: 1, name: 'Ardbeg 10 ans', category: 'Whisky', origin: 'Écosse', abv: 46 },
	{ id: 2, name: 'Hennessy VS', category: 'Cognac', origin: 'France', abv: 40 },
	{ id: 3, name: 'Havana Club 7 ans', category: 'Rhum', origin: 'Cuba', abv: 40 },
	{ id: 4, name: 'Tanqueray London Dry', category: 'Gin', origin: 'Angleterre', abv: 43.1 },
	{ id: 5, name: 'Patrón Silver', category: 'Tequila', origin: 'Mexique', abv: 40 },
	{ id: 6, name: 'Grey Goose', category: 'Vodka', origin: 'France', abv: 40 },
	{ id: 7, name: 'Lagavulin 16 ans', category: 'Whisky', origin: 'Écosse', abv: 43 },
	{ id: 8, name: 'Rémy Martin XO', category: 'Cognac', origin: 'France', abv: 40 },
	{ id: 9, name: 'Diplomático Reserva Exclusiva', category: 'Rhum', origin: 'Venezuela', abv: 40 },
	{ id: 10, name: 'Hendrick’s', category: 'Gin', origin: 'Écosse', abv: 41.4 }
];

export function getAllSpirits(): Spirit[] {
	return spirits;
}
