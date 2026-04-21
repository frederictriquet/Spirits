<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Spiritueux — Spirits</title>
</svelte:head>

<h1>Spiritueux</h1>

<p class="count">{data.spirits.length} spiritueux référencés.</p>

<div class="table-wrapper">
	<table>
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

<style>
	h1 {
		margin-bottom: 0.25rem;
	}

	.count {
		color: var(--color-fg-muted);
		margin-top: 0;
		margin-bottom: 1rem;
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
