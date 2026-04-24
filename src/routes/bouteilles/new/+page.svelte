<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Ajouter une bouteille — Spirits</title>
</svelte:head>

<div class="formulaire-wrapper">
	<h1>Ajouter une bouteille</h1>

	{#if form?.erreur}
		<p class="erreur" role="alert">{form.erreur}</p>
	{/if}

	<form method="POST">
		<label>
			Nom
			<input type="text" name="nom" required autocomplete="off" />
		</label>

		<label>
			Type
			<select name="typeId" required>
				{#each data.types as t (t.id)}
					<option value={t.id}>{t.nom}</option>
				{/each}
			</select>
		</label>

		<label>
			Prix d'achat (€)
			<input type="number" name="prixAchat" min="0.01" step="0.01" required />
		</label>

		<label>
			Degré d'alcool (%)
			<input type="number" name="degreAlcool" min="0.1" max="100" step="0.1" required />
		</label>

		<div class="actions">
			<button type="submit" class="btn-primary">Ajouter</button>
			<a href={resolve('/')} class="btn-annuler">Annuler</a>
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

	input,
	select {
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
		color: var(--color-primary-fg);
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
