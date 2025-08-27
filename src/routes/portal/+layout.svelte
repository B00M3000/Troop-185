<script lang="ts">
  import { ArrowLeft, LogOut, Smartphone, ChevronDown, User, Settings } from 'lucide-svelte'
  import { signOut } from '@auth/sveltekit/client'
  import UserProfile from '@/lib/UserProfile.svelte'
  import RoleBadge from '@/lib/RoleBadge.svelte'
  import { page } from '$app/state';
  import { slide } from 'svelte/transition';

  let { children, data } = $props()
  let showUserMenu = $state(false)
  let isRevokingAllSessions = $state(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleRevokeAllSessions = async () => {
    isRevokingAllSessions = true
    try {
      const response = await fetch('/auth/revoke-all-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Show success message and sign out
        alert(`Successfully signed out of ${result.deletedCount} sessions. You will now be redirected to the login page.`)
        signOut({ callbackUrl: '/' })
      } else {
        alert('Failed to revoke sessions')
      }
    } catch (error) {
      console.error('Error revoking sessions:', error)
      alert('An error occurred while revoking sessions')
    } finally {
      isRevokingAllSessions = false
      showUserMenu = false
    }
  }

  // Close menu when clicking outside
  function handleClickOutside(event) {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      showUserMenu = false
    }
  }
</script>

<svelte:document on:click={handleClickOutside} />

<div class="h-screen bg-gray-50 grid grid-rows-[auto_0_1fr]">
  <!-- Portal Navbar -->
  <nav class="bg-white shadow-sm z-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <!-- Left side - Back to site -->
        <div class="flex items-center">
          <a href="/" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors" data-sveltekit-preload-data>
            <ArrowLeft class="w-5 h-5 mr-2" />
            <span class="font-medium hidden sm:inline">Back to Main Site</span>
            <span class="font-medium sm:hidden">Back</span>
          </a>
        </div>

        <!-- Center - Portal Title -->
        <div class="relative">
          <h1 class="text-xl font-semibold text-blue-800 hidden md:block">Troop 185 Portal</h1>
        </div>

        <!-- Right side - User info and logout -->
        <div class="flex items-center gap-4 justify-end">
          {#if data.session?.user}
            <!-- User Menu Container -->
            <div class="relative user-menu-container">
              <!-- User Profile Button -->
              <button 
                class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                onclick={() => showUserMenu = !showUserMenu}
              >
                <UserProfile user={data.session.user} size="md" />
                <ChevronDown class="w-4 h-4 text-gray-500 {showUserMenu ? 'rotate-180' : ''} transition-transform" />
              </button>

              <!-- Dropdown Menu -->
              {#if showUserMenu}
                <div 
                  class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50"
                  transition:slide={{ duration: 200 }}
                >
                  <div class="py-1">
                    <!-- User Info Header -->
                    <div class="px-4 py-3 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900">{data.session.user.name}</p>
                      <p class="text-sm text-gray-500">{data.session.user.email}</p>
                      <div class="mt-1">
                        <RoleBadge role={data.session.user.role} size="sm" />
                      </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-1">
                      <!-- Sign out current session -->
                      <button
                        onclick={handleSignOut}
                        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut class="w-4 h-4 mr-3" />
                        Sign out
                      </button>

                      <!-- Sign out of all devices -->
                      <button
                        onclick={handleRevokeAllSessions}
                        disabled={isRevokingAllSessions}
                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Smartphone class="w-4 h-4 mr-3" />
                        {isRevokingAllSessions ? 'Signing out...' : 'Sign out of all devices'}
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <!-- Page breadcrumb popup -->
  <div class="relative overflow-hidden h-12">
  {#if page.url.pathname !== '/portal' && page.url.pathname !== '/portal/login'}
    <a 
      href="/portal" 
      class="absolute top-0 left-1/2 transform z-10 -translate-x-1/2 text-gray-500 bg-white shadow rounded-b-lg min-w-72 px-4 py-2 flex justify-center hover:bg-gray-50 transition-colors"
      in:slide={{ duration: 300, axis: 'y', delay: 100 }}
      out:slide={{ duration: 200, axis: 'y' }}
      data-sveltekit-preload-data
    >
      <div class="flex items-center text-gray-600">
        <ArrowLeft class="w-4 h-4 mr-2" />
        <span class="text-sm font-semibold">Return to Portal Home</span>
      </div>
    </a>
  {/if}
  </div>

  <!-- Page content -->
  <div>
    {@render children()}
  </div>
</div>

<style lang=postcss>
  @reference "tailwindcss";

  :global(html) {
    background-color: var(--color-gray-50);
  }
</style>