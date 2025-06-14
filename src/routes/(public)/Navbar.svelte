<script>
    import { Menu, X, Home, Info, Mail, User, Calendar, BookOpen, FileText, Feather } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';
    import { page } from '$app/stores';
    let menuOpen = false;
</script>

<nav class="sticky top-0 z-50 backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 text-gray-800 dark:text-gray-100 shadow-md">
  <div class="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
    <!-- Left -->
    <div class="flex items-center space-x-4">
        <a class="flex items-center gap-4" href="/">
            <img src="/logo.png" alt="Troop 185 Logo" class="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-lg bg-white p-1" />
            <span class="text-2xl font-extrabold tracking-tight">Troop 185</span>
        </a>
    </div>

    <!-- Right -->
    <div class="flex items-center">
        <button
            class="lg:hidden p-2 focus:outline-none text-gray-800 dark:text-gray-100"
            on:click={() => (menuOpen = !menuOpen)}
        >
            {#if menuOpen}
              <X class="w-6 h-6" />
            {:else}
              <Menu class="w-6 h-6" />
            {/if}
        </button>
        <!-- Desktop Menu -->
        <ul class="hidden lg:flex space-x-6 justify-end items-center">
          <li>
            <a
              href="/"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/'}
            ><Home class="w-4 h-4"/> Home</a>
          </li>
          <li>
            <a
              href="/about"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/about'}
            ><Info class="w-4 h-4"/> About</a>
          </li>
          <li>
            <a
              href="/contact"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/contact'}
            ><Mail class="w-4 h-4"/> Contact</a>
          </li>
          <li>
            <a
              href="/portal"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/portal'}
            ><User class="w-4 h-4"/> Portal</a>
          </li>
          <li>
            <a
              href="/trips-events"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/trips-events'}
            ><Calendar class="w-4 h-4"/> Trips</a>
          </li>
          <li>
            <a
              href="/scouting-101"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/scouting-101'}
            ><BookOpen class="w-4 h-4"/> Scouting</a>
          </li>
          <li>
            <a
              href="/misc-forms"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/misc-forms'}
            ><FileText class="w-4 h-4"/> Forms</a>
          </li>
          <li>
            <a
              href="/eagle-nest"
              class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              class:text-yellow-300={$page.url.pathname === '/eagle-nest'}
            ><Feather class="w-4 h-4"/> Eagle Nest</a>
          </li>
        </ul>
        <!-- Mobile Menu -->
        {#if menuOpen}
          <div
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}
            class="absolute inset-x-0 top-full lg:hidden"
          >
            <ul
              class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex flex-col items-center py-4 space-y-4 shadow-lg"
              in:slide={{ duration: 200 }}
              out:slide={{ duration: 200 }}
            >
              <li><a href="/" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><Home class="w-6 h-6"/> Home</a></li>
              <li><a href="/about" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><Info class="w-6 h-6"/> About</a></li>
              <li><a href="/contact" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><Mail class="w-6 h-6"/> Contact</a></li>
              <li><a href="/portal" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><User class="w-6 h-6"/> Portal</a></li>
              <li><a href="/trips-events" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><Calendar class="w-6 h-6"/> Trips</a></li>
              <li><a href="/scouting-101" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><BookOpen class="w-6 h-6"/> Scouting</a></li>
              <li><a href="/misc-forms" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><FileText class="w-6 h-6"/> Forms</a></li>
              <li><a href="/eagle-nest" class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md"><Feather class="w-6 h-6"/> Eagle Nest</a></li>
            </ul>
          </div>
        {/if}
      </div>
  </div>
</nav>
