<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Spirits</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="app-header">
	<ThemeToggle />
</header>

<main>
	{@render children()}
</main>

<style>
	.app-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 1rem;
	}

	main {
		padding: 0 1rem 2rem;
	}
</style>
