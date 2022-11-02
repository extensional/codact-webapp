<script>
  import Header from '$lib/header/Header.svelte';
  import '../app.css';
  import { dev, browser } from '$app/environment';
  $: if (dev && browser) window.mixpanel.track = function () { }
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <!-- <p>Powered by <a href="https://extensional.ai">extensional.ai</a></p> -->
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

</style>
