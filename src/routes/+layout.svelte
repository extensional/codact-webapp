<script>
  import Header from '$lib/header/Header.svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import '../app.css';
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <p>Powered by <a href="https://extensional.ai">extensional.ai</a></p>
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
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
