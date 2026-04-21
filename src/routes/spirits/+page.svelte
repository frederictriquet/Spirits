<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Spiritueux — Spirits</title>
</svelte:head>

<h1>Spiritueux</h1>

<p class="count">{data.spirits.length} spiritueux référencés.</p>

{#if data.spirits.length === 0}
	<p class="empty">Aucun spiritueux à afficher.</p>
{:else}
	<div class="table-wrapper">
		<table>
			<caption class="sr-only">Liste des spiritueux référencés</caption>
			<thead>
				<tr>
					<th scope="col">Nom</th>
					<th scope="col">Catégorie</th>
					<th scope="col">Origine</th>
					<th scope="col" class="num">Degré&nbsp;(%)</th>
				</tr>
			</thead>
			<tbody>
				{#each data.spirits as spirit (spirit.id)}
					<tr>
						<td>{spirit.name}</td>
						<td>{spirit.category}</td>
						<td>{spirit.origin}</td>
						<td class="num">{spirit.abv.toLocaleString('fr-FR')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	h1 {
		margin-bottom: 0.25rem;
	}

	.count {
		color: var(--color-fg-muted);
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.empty {
		color: var(--color-fg-muted);
		font-style: italic;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	th {
		background: var(--color-bg);
		font-weight: 600;
	}

	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
</style>
