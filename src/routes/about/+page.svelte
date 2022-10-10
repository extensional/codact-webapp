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
	<h1>Codact: Interactive AI Programming</h1>

	<p>
		With codact, you write code by interacting with an AI.   This is an entirely new way to program, 
		and there are many possible uses.  Try to create entire apps all in one go, find bugs in apps its generated, modify code you've created, 
		fork and share your coding conversations.
	</p>

	<h1> Using Codact </h1>
	<p> 1. Select where you want to insert code, or select what code you want modified. </p>
	<p> 2. Tell codact what you want to do, create, or know. </p>
	<p> 3. Click the fork icon to revert to a previous point in the code. </p>

	<h1> Disclaimer </h1>

	This product is still in beta.  Use it at your own risk.   Don't share malicious code. Don't give it your personal information. 

</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
