<script>
    let menuOpen = false;
</script>

<nav class="bg-blue-700 text-white shadow-lg flex justify-between p-4">
    <!-- Left -->
    <div class="flex items-center">
        <a class="flex items-center gap-4" href="/">
            <img src="/logo.png" alt="Troop 185 Logo" class="w-14 h-14" />
            <span class="text-2xl font-bold">Troop 185 Wellesley, MA</span>
        </a>
    </div>

    <!-- Right -->
    <div class="flex items-center">
        <button
            class="lg:hidden p-2 focus:outline-none"
            on:click={() => (menuOpen = !menuOpen)}
        >
        <span class="material-icons">{menuOpen ? 'close' : 'menu'}</span>
        </button>
        <ul
        class="hidden lg:flex space-x-6"
        class:hidden={!menuOpen && 'hidden'}
        >
        <li><a href="/" class="hover:underline">Home</a></li>
        <li><a href="/about" class="hover:underline">About</a></li>
        <li><a href="/contact" class="hover:underline">Contact</a></li>
        <li><a href="/portal" class="hover:underline">Member Portal</a></li>
        </ul>
    </div>
</nav>
