<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Types de spiritueux — Spirits</title>
</svelte:head>

<div class="wrapper">
	<div class="entete">
		<h1>Types de spiritueux</h1>
		<a href={resolve('/types/new')} class="btn-ajouter">Ajouter un type</a>
	</div>

	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th class="actions-col">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each data.types as t (t.id)}
				<tr>
					<td>{t.nom}</td>
					<td class="actions">
						<a href={resolve('/types/[id]/edit', { id: t.id.toString() })} class="btn-modifier"
							>Modifier</a
						>
						<form
							method="POST"
							action="?/delete&id={t.id}"
							onsubmit={(e) => {
								if (!confirm(`Supprimer le type "${t.nom}" ?`)) e.preventDefault();
							}}
						>
							<button type="submit" class="btn-supprimer">Supprimer</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if form?.erreur}
		<p class="erreur" role="alert">{form.erreur}</p>
	{/if}
</div>

<style>
	.wrapper {
		max-width: 48rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.entete {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
		color: var(--color-primary);
	}

	.btn-ajouter {
		padding: 0.5rem 1.25rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.btn-ajouter:hover {
		opacity: 0.9;
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
		padding: 0.75rem;
		background: var(--color-surface);
		border-bottom: 2px solid var(--color-border);
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--color-fg-muted);
	}

	.actions-col {
		width: 12rem;
	}

	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-fg);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.btn-modifier {
		padding: 0.3rem 0.75rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.4rem;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.btn-modifier:hover {
		opacity: 0.9;
	}

	.btn-supprimer {
		padding: 0.3rem 0.75rem;
		background: transparent;
		border: 1px solid color-mix(in srgb, red 40%, transparent);
		border-radius: 0.4rem;
		color: color-mix(in srgb, red 70%, var(--color-fg));
		font-size: 0.875rem;
		cursor: pointer;
	}

	.btn-supprimer:hover {
		background: color-mix(in srgb, red 10%, transparent);
	}

	.erreur {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
		border-radius: 0.5rem;
		color: var(--color-fg);
	}
</style>
