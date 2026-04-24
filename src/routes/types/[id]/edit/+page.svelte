<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Modifier le type — Spirits</title>
</svelte:head>

<div class="formulaire-wrapper">
	<h1>Modifier le type</h1>

	{#if form?.erreur}
		<p class="erreur" role="alert">{form.erreur}</p>
	{/if}

	<form method="POST">
		<label>
			Nom
			<input type="text" name="nom" value={data.type.nom} required autocomplete="off" />
		</label>

		<div class="actions">
			<button type="submit" class="btn-primary">Enregistrer</button>
			<a href={resolve('/types')} class="btn-annuler">Annuler</a>
		</div>
	</form>
</div>

<style>
	.formulaire-wrapper {
		max-width: 32rem;
		margin: 2rem auto;
	}

	h1 {
		margin-bottom: 1.5rem;
		color: var(--color-primary);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-weight: 600;
		color: var(--color-fg-muted);
		font-size: 0.9rem;
	}

	input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-surface);
		color: var(--color-fg);
		font-size: 1rem;
		font-weight: 400;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.btn-primary {
		padding: 0.6rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-annuler {
		padding: 0.6rem 1.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-fg-muted);
		text-decoration: none;
		font-size: 1rem;
	}

	.btn-annuler:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.erreur {
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
		border-radius: 0.5rem;
		color: var(--color-fg);
	}
</style>
