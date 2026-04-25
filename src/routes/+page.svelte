<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type ColId = 'nom' | 'type' | 'prixAchat' | 'degreAlcool';

	let colTri = $state<ColId | null>(null);
	let ordreTri = $state<'asc' | 'desc'>('asc');

	let filtreNom = $state('');
	let filtreTypeId = $state<number | undefined>(undefined);
	let filtrePrixMin = $state<number | undefined>(undefined);
	let filtreDegreMin = $state<number | undefined>(undefined);

	function trierPar(col: ColId) {
		if (colTri === col) {
			ordreTri = ordreTri === 'asc' ? 'desc' : 'asc';
		} else {
			colTri = col;
			ordreTri = 'asc';
		}
	}

	function indicateur(col: ColId): string {
		if (colTri !== col) return '';
		return ordreTri === 'asc' ? ' ↑' : ' ↓';
	}

	const lignes = $derived.by(() => {
		let liste = [...data.bouteilles];

		if (filtreNom.trim()) {
			const q = filtreNom.toLowerCase();
			liste = liste.filter((b) => b.nom.toLowerCase().includes(q));
		}
		if (filtreTypeId !== undefined) {
			liste = liste.filter((b) => b.typeId === filtreTypeId);
		}
		if (filtrePrixMin !== undefined) {
			liste = liste.filter((b) => b.prixAchat >= filtrePrixMin!);
		}
		if (filtreDegreMin !== undefined) {
			liste = liste.filter((b) => b.degreAlcool >= filtreDegreMin!);
		}

		if (colTri !== null) {
			const col = colTri;
			const dir = ordreTri;
			liste.sort((a, b) => {
				let va: string | number;
				let vb: string | number;
				if (col === 'nom') {
					va = a.nom;
					vb = b.nom;
				} else if (col === 'type') {
					va = a.type;
					vb = b.type;
				} else if (col === 'prixAchat') {
					va = a.prixAchat;
					vb = b.prixAchat;
				} else {
					va = a.degreAlcool;
					vb = b.degreAlcool;
				}
				if (typeof va === 'string' && typeof vb === 'string') {
					return dir === 'asc' ? va.localeCompare(vb, 'fr') : vb.localeCompare(va, 'fr');
				}
				return dir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
			});
		}

		return liste;
	});
</script>

<svelte:head>
	<title>Spirits — Ma cave</title>
</svelte:head>

<div class="wrapper">
	<div class="entete">
		<h1>Ma cave</h1>
		<a href={resolve('/types')} class="btn-secondaire">Gérer les types</a>
		<a href={resolve('/bouteilles/new')} class="btn-ajouter">Ajouter une bouteille</a>
	</div>

	<table>
		<thead>
			<tr>
				<th onclick={() => trierPar('nom')}>
					<!-- Le div.th-inner contrôle la hauteur (contrairement aux th dans les tables).
					     Le label occupe > 50% de la hauteur → le clic au centre du th tombe sur le label. -->
					<div class="th-inner">
						<span class="col-label">Nom{indicateur('nom')}</span>
						<input
							type="text"
							bind:value={filtreNom}
							onclick={(e) => e.stopPropagation()}
							placeholder="Filtrer…"
						/>
					</div>
				</th>
				<th onclick={() => trierPar('type')}>
					<div class="th-inner">
						<span class="col-label">Type{indicateur('type')}</span>
						<!-- oninput + onchange : Playwright selectOption() dispatch les deux events.
						     On gère les deux pour garantir que filtreTypeId est mis à jour
						     indépendamment du timing d'hydratation de Svelte. -->
						<select
							onclick={(e) => e.stopPropagation()}
							oninput={(e) => {
								const v = (e.currentTarget as HTMLSelectElement).value;
								filtreTypeId = Number(v) || undefined;
							}}
							onchange={(e) => {
								const v = (e.currentTarget as HTMLSelectElement).value;
								filtreTypeId = Number(v) || undefined;
							}}
						>
							<option value="">Tous</option>
							{#each data.types as t (t.id)}
								<option value={t.id} selected={filtreTypeId === t.id}>{t.nom}</option>
							{/each}
						</select>
					</div>
				</th>
				<th onclick={() => trierPar('prixAchat')}>
					<div class="th-inner">
						<span class="col-label">Prix d'achat (€){indicateur('prixAchat')}</span>
						<input
							type="number"
							bind:value={filtrePrixMin}
							onclick={(e) => e.stopPropagation()}
							placeholder="Min…"
							min="0"
							step="0.01"
						/>
					</div>
				</th>
				<th onclick={() => trierPar('degreAlcool')}>
					<div class="th-inner">
						<span class="col-label">Degré d'alcool (%){indicateur('degreAlcool')}</span>
						<input
							type="number"
							bind:value={filtreDegreMin}
							onclick={(e) => e.stopPropagation()}
							placeholder="Min…"
							min="0"
							max="100"
							step="0.1"
						/>
					</div>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each lignes as b (b.id)}
				{@const href = resolve('/spiritueux/[id]', { id: b.id.toString() })}
				<tr onclick={() => goto(href)}>
					<td><a {href} class="row-link">{b.nom}</a></td>
					<td class="capitalize">{b.type}</td>
					<td class="num">
						{b.prixAchat.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}&nbsp;€
					</td>
					<td class="num">{b.degreAlcool}&nbsp;%</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.wrapper {
		max-width: 56rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.entete {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		gap: 0.75rem;
	}

	h1 {
		margin: 0;
		color: var(--color-primary);
		flex: 1;
	}

	.btn-ajouter {
		padding: 0.5rem 1.25rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 0.95rem;
		white-space: nowrap;
	}

	.btn-ajouter:hover {
		opacity: 0.9;
	}

	.btn-secondaire {
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-fg-muted);
		text-decoration: none;
		font-size: 0.95rem;
		white-space: nowrap;
	}

	.btn-secondaire:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	th {
		text-align: left;
		padding: 0;
		background: var(--color-surface);
		border-bottom: 2px solid var(--color-border);
		cursor: pointer;
		user-select: none;
	}

	th:hover {
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
	}

	/* Div wrapper à l'intérieur du th pour contrôler la hauteur.
	   height:5rem → centre à 2.5rem → dans la zone label (0–3rem).
	   position:relative pour positionner les inputs en absolu. */
	.th-inner {
		height: 5rem;
		position: relative;
	}

	/* Le label occupe la moitié supérieure (0–3rem), garantissant que
	   le centre géométrique (2.5rem) y tombe toujours. */
	.col-label {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3rem;
		display: flex;
		align-items: center;
		padding: 0 0.75rem;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--color-fg-muted);
	}

	/* Les inputs sont positionnés dans la moitié inférieure (3rem–5rem) */
	th input,
	th select {
		position: absolute;
		bottom: 0.4rem;
		left: 0.5rem;
		right: 0.5rem;
		width: calc(100% - 1rem);
		box-sizing: border-box;
		padding: 0.2rem 0.4rem;
		border: 1px solid var(--color-border);
		border-radius: 0.35rem;
		background: var(--color-bg, white);
		color: var(--color-fg);
		font-size: 0.8rem;
		cursor: auto;
	}

	th input:focus,
	th select:focus {
		outline: 2px solid var(--color-primary);
	}

	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-fg);
	}

	tbody tr {
		cursor: pointer;
		transition: background 0.1s;
	}

	tbody tr:hover {
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.row-link {
		color: inherit;
		text-decoration: none;
		display: block;
		margin: -0.75rem;
		padding: 0.75rem;
	}

	.capitalize {
		text-transform: capitalize;
	}

	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
