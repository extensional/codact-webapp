<script>

	import url from '$lib/url.js';
	import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
	
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// THIS IS THE PATTERN
	let gen = "";
	let showcase = false;
	$: if ($url || $page.url) {
		gen = ($url ? $url : $page.url).searchParams.get('gen');
		showcase = ($url ? $url : $page.url).searchParams.get('showcase');
		if (browser)
			document.body.style.cursor='default';
	}
	let params = "";
	$: params = gen ? `?gen=${gen}` : "";

	function mouseWait() {
		document.body.style.cursor='wait'; 
		return true;
	}

	
    onMount(() => {
		document.body.style.cursor='default';
	});
</script>

<svelte:window on:popstate={(e) => invalidateAll() } />

<header>
	<div class="corner">
		<a href="https://extensional.ai">
			<img src="/logo.png" alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li><a data-sveltekit-prefetch href="/"  on:click={mouseWait}>new</a></li>
			{#key url}
			<li class:active={$page.url.pathname === '/'}>
				<a data-sveltekit-prefetch href="/{params}"  on:click={mouseWait}>edit</a>
			</li>
			{#if (params != "")}
			<li class:active={$page.url.pathname === '/forks' && !showcase}>
				<a data-sveltekit-prefetch href="/forks{params}"  on:click={mouseWait}>forks</a>
			</li>
			{/if}
			<li class:active={$page.url.pathname === '/forks' && showcase}>
				<a data-sveltekit-prefetch href="/forks{params}{params == "" ? '?' : '&'}showcase=true"  on:click={mouseWait}>showcase</a>
			</li>
			<li class:active={$page.url.pathname === '/about'}>
				<a data-sveltekit-prefetch href="/about{params}" on:click={mouseWait}>Readme</a>
			</li>
			{/key}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="/{params}" on:click={mouseWait}>{gen ? gen.slice(18).concat(' ') : ''}</a><!-- TODO put something else here? github link? -->
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 5em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: grey;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--nav-color);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
