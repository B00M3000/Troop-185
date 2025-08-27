<script>
  import Navbar from './Navbar.svelte';
  import Footer from './Footer.svelte';

  let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <main class="grow">
    {@render children()}
  </main>
  <Footer />
</div>
