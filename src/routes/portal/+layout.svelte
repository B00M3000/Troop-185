<script lang="ts">
  import { ArrowLeft, LogOut } from 'lucide-svelte'
  import { signOut } from '@auth/sveltekit/client'
  import UserProfile from '@/lib/UserProfile.svelte'

  let { children, data } = $props()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }
</script>

<div class="h-screen bg-gray-50 grid grid-rows-[auto,1fr]">
  <!-- Portal Navbar -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-[1fr,auto,1fr] items-center h-16">
        <!-- Left side - Back to site -->
        <div class="flex items-center">
          <a href="/" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft class="w-5 h-5 mr-2" />
            <span class="font-medium">Back to Site</span>
          </a>
        </div>

        <!-- Center - Portal Title -->
        <div class="hidden md:block">
          <h1 class="text-xl font-semibold text-blue-800">Troop 185 Portal</h1>
        </div>

        <!-- Right side - User info and logout -->
        <div class="flex items-center gap-4 justify-end">
          {#if data.session?.user}
            <UserProfile user={data.session.user} size="md" />
            <button 
              onclick={handleSignOut}
              class="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut class="w-5 h-5" />
            </button>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <!-- Page content -->
  <div>
    {@render children()}
  </div>
</div>
