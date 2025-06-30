<script lang=ts>
    import { Menu, X, Home, Info, Mail, User, Calendar, BookOpen, FileText, Feather } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';
    import { page } from '$app/stores';

    let menuOpen = $state(false);

    const navLinks = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'About', href: '/about', icon: Info },
      // { name: 'Contact', href: '/contact', icon: Mail },
      { name: 'Trips and Events', href: '/trips-events', icon: Calendar },
      { name: 'Scouting Resources', href: '/resources', icon: BookOpen },
      // { name: 'Scouting', href: '/scouting-101', icon: BookOpen },
      // { name: 'Forms', href: '/misc-forms', icon: FileText },
      // { name: 'Eagle Nest', href: '/eagle-nest', icon: Feather },
      { name: 'Portal', href: '/portal', icon: User },
    ];
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
            onclick={() => (menuOpen = !menuOpen)}
        >
            {#if menuOpen}
              <X class="w-6 h-6" />
            {:else}
              <Menu class="w-6 h-6" />
            {/if}
        </button>
        <!-- Desktop Menu -->
        <ul class="hidden lg:flex space-x-6 justify-end items-center">
          {#each navLinks as link}
            <li>
              <a
                href={link.href}
                class="flex items-center gap-1 py-1 px-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                class:dark:text-yellow-300={$page.url.pathname === link.href}
                class:font-semibold={$page.url.pathname === link.href}
                class:text-yellow-500={$page.url.pathname === link.href}
              >
                <link.icon class="w-4 h-4" /> {link.name}
              </a>
            </li>
          {/each}
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
              {#each navLinks as link}
                <li>
                  <a href={link.href} class="flex items-center gap-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md">
                    <link.icon class="w-6 h-6" /> {link.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
  </div>
</nav>
