<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Spirits — Catalogue</title>
</svelte:head>

<h1>Catalogue des spiritueux</h1>

<ul class="liste">
	{#each data.spiritueux as s (s.id)}
		<li>
			<a class="carte" href={resolve('/spiritueux/[id]', { id: s.id })}>
				<span class="nom">{s.nom}</span>
				<span class="type">{s.type}</span>
				<span class="degre">{s.degreAlcool}&nbsp;%</span>
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
		grid-template-columns: 1fr max-content max-content;
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

	.type {
		color: var(--color-fg-muted);
		text-transform: capitalize;
	}

	.degre {
		color: var(--color-fg-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
