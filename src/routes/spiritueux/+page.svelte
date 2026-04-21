<script lang="ts">
	import type { Spiritueux } from '$lib/types/spiritueux';

	const spiritueux: Spiritueux = {
		nom: 'Lagavulin 16 ans',
		degreAlcool: 43,
		type: 'whisky'
	};
</script>

<svelte:head>
	<title>Spiritueux — {spiritueux.nom}</title>
</svelte:head>

<article class="carte">
	<h1>{spiritueux.nom}</h1>
	<dl>
		<dt>Type</dt>
		<dd class="type">{spiritueux.type}</dd>

		<dt>Degré d'alcool</dt>
		<dd>{spiritueux.degreAlcool}%</dd>
	</dl>
</article>

<style>
	.carte {
		max-width: 32rem;
		margin: 2rem auto;
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
	}

	h1 {
		margin: 0 0 1rem;
		color: var(--color-primary);
	}

	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	dt {
		color: var(--color-fg-muted);
		font-weight: 600;
	}

	dd {
		margin: 0;
		color: var(--color-fg);
	}

	.type {
		text-transform: capitalize;
	}
</style>
