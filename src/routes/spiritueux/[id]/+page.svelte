<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Spiritueux — {data.bouteille.nom}</title>
</svelte:head>

<article class="carte">
	<h1>{data.bouteille.nom}</h1>
	<dl>
		<dt>Type</dt>
		<dd class="capitalize">{data.bouteille.type}</dd>

		<dt>Prix d'achat</dt>
		<dd>{data.bouteille.prixAchat.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}&nbsp;€</dd>

		<dt>Degré d'alcool</dt>
		<dd>{data.bouteille.degreAlcool}&nbsp;%</dd>
	</dl>

	<div class="btns">
		<a href={resolve('/')} class="btn-home">← Ma cave</a>
		<a
			href={resolve('/bouteilles/[id]/edit', { id: data.bouteille.id.toString() })}
			class="btn-modifier">Modifier</a
		>

		<form
			method="POST"
			action="?/delete"
			onsubmit={(e) => {
				if (!confirm('Supprimer cette bouteille ?')) e.preventDefault();
			}}
		>
			<button type="submit" class="btn-supprimer">Supprimer</button>
		</form>
	</div>
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
		margin: 0 0 1.5rem;
	}

	dt {
		color: var(--color-fg-muted);
		font-weight: 600;
	}

	dd {
		margin: 0;
		color: var(--color-fg);
	}

	.capitalize {
		text-transform: capitalize;
	}

	.btns {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.btn-home {
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-fg-muted);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.btn-home:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.btn-modifier {
		padding: 0.5rem 1.25rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.btn-modifier:hover {
		opacity: 0.9;
	}

	.btn-supprimer {
		padding: 0.5rem 1.25rem;
		background: transparent;
		border: 1px solid color-mix(in srgb, red 40%, transparent);
		border-radius: 0.5rem;
		color: color-mix(in srgb, red 70%, var(--color-fg));
		font-size: 0.95rem;
		cursor: pointer;
	}

	.btn-supprimer:hover {
		background: color-mix(in srgb, red 10%, transparent);
	}
</style>
