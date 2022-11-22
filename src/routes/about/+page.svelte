<script>
	import { browser } from '$app/environment';	
	
	$: if (browser) { 
	    window.mixpanel.track('about.load'); // mixpanel loaded direclty in app.html
  	}
</script>

<svelte:head>
	<title>LTSPK README</title>
	<meta name="description" content="About LeetSpeak" />
</svelte:head>

<div class="content">
	<h1>Exploring Artificial Generative Interactivity (AGI) </h1>

	<p>
		With LeetSpeak, you write code by interacting with an AI.   This is an entirely new way to program, 
		and there are many possible uses.  Try to create entire apps all in one go, find bugs in apps its generated, modify code you've created, 
		fork and share your coding conversations.
	</p>

	<h1>Using LeetSpeak</h1>
	<p> 1. Select where you want to insert code, or select what code you want modified. </p>
	<p> 2. Tell codact what you want to do, create, or know. </p>
	<p> 3. Click permalink to copy a link to a point in the code conversation. </p>
	<p> 4. Click fork to open a point in the code conversation in a new window. </p>
	<p> 5. Click the pink title in the top right to edit the title of the code going forward </p>
	

	<h1> Disclaimer </h1>

	<p>This product is still in beta.  Use it at your own risk.   Don't share malicious code. Don't give it your personal information. </p>

</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;		
	}
	.content h1 {
		color: var(--primary-color);
	}
	.content p {
		color: var(--primary-color);
	}

</style>
