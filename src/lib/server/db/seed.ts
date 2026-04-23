import { db } from './index';
import { bouteilles } from './schema';

// Données initiales — 10 spiritueux représentatifs.
const donnees = [
	{ nom: 'Ardbeg 10 ans', type: 'whisky', prixAchat: 55.0, degreAlcool: 46 },
	{ nom: 'Hennessy VS', type: 'cognac', prixAchat: 38.0, degreAlcool: 40 },
	{ nom: 'Havana Club 7 ans', type: 'rhum', prixAchat: 22.0, degreAlcool: 40 },
	{ nom: 'Tanqueray London Dry', type: 'gin', prixAchat: 20.0, degreAlcool: 43.1 },
	{ nom: 'Patrón Silver', type: 'tequila', prixAchat: 45.0, degreAlcool: 40 },
	{ nom: 'Grey Goose', type: 'vodka', prixAchat: 35.0, degreAlcool: 40 },
	{ nom: 'Lagavulin 16 ans', type: 'whisky', prixAchat: 85.0, degreAlcool: 43 },
	{ nom: 'Rémy Martin XO', type: 'cognac', prixAchat: 180.0, degreAlcool: 40 },
	{ nom: 'Diplomático Reserva Exclusiva', type: 'rhum', prixAchat: 42.0, degreAlcool: 40 },
	{ nom: "Hendrick's", type: 'gin', prixAchat: 38.0, degreAlcool: 41.4 }
];

db.insert(bouteilles).values(donnees).run();
console.log(`${donnees.length} bouteilles insérées.`);
