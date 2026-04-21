<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Spiritueux — {data.spirit.name}</title>
</svelte:head>

<article class="carte">
	<h1>{data.spirit.name}</h1>
	<dl>
		<dt>Catégorie</dt>
		<dd>{data.spirit.category}</dd>

		<dt>Origine</dt>
		<dd>{data.spirit.origin}</dd>

		<dt>Degré d'alcool</dt>
		<dd>{data.spirit.abv.toLocaleString('fr-FR')}&nbsp;%</dd>
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
</style>
