<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Spirits — Catalogue</title>
</svelte:head>

<h1>Catalogue des spiritueux</h1>

<ul class="liste">
	{#each data.spirits as spirit (spirit.id)}
		<li>
			<a class="carte" href={resolve('/spiritueux/[id]', { id: String(spirit.id) })}>
				<span class="nom">{spirit.name}</span>
				<span class="type">{spirit.category}</span>
				<span class="origine">{spirit.origin}</span>
				<span class="degre">{spirit.abv.toLocaleString('fr-FR')}&nbsp;%</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	h1 {
		max-width: 48rem;
		margin: 2rem auto 1rem;
		color: var(--color-primary);
	}

	.liste {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.75rem;
	}

	.carte {
		display: grid;
		grid-template-columns: 1fr max-content max-content max-content;
		align-items: baseline;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		color: var(--color-fg);
		text-decoration: none;
		transition: border-color 0.15s ease;
	}

	.carte:hover {
		border-color: var(--color-primary);
	}

	.nom {
		font-weight: 600;
	}

	.type,
	.origine {
		color: var(--color-fg-muted);
	}

	.degre {
		color: var(--color-fg-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
