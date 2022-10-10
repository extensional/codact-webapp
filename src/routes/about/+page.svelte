<script>
	import { browser } from '$app/environment';	
	import mixpanel from 'mixpanel-browser';
	$: if (browser) { 
		mixpanel.init('705a7eef381e043f43ca111a0b4d067e', {debug: import.meta.env.DEV, ignore_dnt: true, api_host: "https://api.mixpanel.com"});
	    mixpanel.track('about.load');
  	}
</script>

<svelte:head>
	<title>Codact README</title>
	<meta name="description" content="About codact" />
</svelte:head>

<div class="content">
	<h1>About Codact</h1>

	<p>
		Codact.dev is a new way to code for creating code by to an AI. Using it is pretty simple:
	</p>
	<p> 1. tell codact </p>
	<pre>npm create svelte@latest</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
