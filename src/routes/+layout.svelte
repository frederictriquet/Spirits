<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Jost:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
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
