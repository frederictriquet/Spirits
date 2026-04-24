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
					<span class="col-label">Nom{indicateur('nom')}</span>
					<input
						type="text"
						value={filtreNom}
						oninput={(e) => {
							filtreNom = e.currentTarget.value;
						}}
						onclick={(e) => e.stopPropagation()}
						placeholder="Filtrer…"
					/>
				</th>
				<th onclick={() => trierPar('type')}>
					<span class="col-label">Type{indicateur('type')}</span>
					<select bind:value={filtreTypeId} onclick={(e) => e.stopPropagation()}>
						<option value={undefined}>Tous</option>
						{#each data.types as t (t.id)}
							<option value={t.id}>{t.nom}</option>
						{/each}
					</select>
				</th>
				<th onclick={() => trierPar('prixAchat')}>
					<span class="col-label">Prix d'achat (€){indicateur('prixAchat')}</span>
					<input
						type="number"
						bind:value={filtrePrixMin}
						onclick={(e) => e.stopPropagation()}
						placeholder="Min…"
						min="0"
						step="0.01"
					/>
				</th>
				<th onclick={() => trierPar('degreAlcool')}>
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
				</th>
			</tr>
		</thead>
		<tbody>
			{#each lignes as b (b.id)}
				<tr onclick={() => goto(resolve('/spiritueux/[id]', { id: b.id.toString() }))}>
					<td>{b.nom}</td>
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

	.col-label {
		display: block;
		padding: 0.75rem 0.75rem 1.25rem;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--color-fg-muted);
	}

	th input,
	th select {
		display: block;
		width: calc(100% - 1rem);
		box-sizing: border-box;
		padding: 0.2rem 0.4rem;
		margin: 0 0.5rem 0.5rem;
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

	.capitalize {
		text-transform: capitalize;
	}

	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
