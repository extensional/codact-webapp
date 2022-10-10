<script>
	import { browser } from '$app/environment';	
	$: if (browser) { 
	    window.mixpanel.track('about.load'); // mixpanel loaded direclty in app.html
  	}
</script>

<svelte:head>
	<title>Codact README</title>
	<meta name="description" content="About codact" />
</svelte:head>

<div class="content">
	<h1>About Codact</h1>

	<p>
		Codact.dev is an entirely new way to code by creating code by to an AI. Using it is pretty simple:
	</p>
	<p> 1. Select where you want to insert code, or what code you want replaced Tell codact what you want it to code. </p>
	<p> 2. Tell codact what you want to create. </p>
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
