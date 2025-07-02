<script lang="ts">
  import { page } from '$app/stores';
  import { Home, Settings, RefreshCw, ArrowLeft, Mail } from 'lucide-svelte';
  
  let { error }: { error: App.Error } = $props();
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-lg">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <!-- Error Icon -->
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
        <Settings class="h-8 w-8 text-red-600" />
      </div>

      <!-- Error Content -->
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Portal Error
        </h1>
        
        <p class="text-sm text-gray-600 mb-6">
          There was an issue accessing the portal. This could be due to a server error or access restrictions.
        </p>

        {#if error?.message}
          <div class="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p class="text-sm text-red-800 font-mono">
              {error.message}
            </p>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="space-y-3">
          <a
            href="/portal"
            class="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Settings class="w-4 h-4 mr-2" />
            Return to Portal Home
          </a>
          
          <button
            onclick={() => window.location.reload()}
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            Retry
          </button>
          
          <a
            href="/portal/login"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Sign In Again
          </a>
          
          <a
            href="/"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home class="w-4 h-4 mr-2" />
            Public Site
          </a>
          
          <a
            href="mailto:webmaster@mytroop185.com?subject=Portal Error&body=I encountered an error in the portal.%0A%0AError: {encodeURIComponent(error?.message || 'Unknown error')}%0APage: {encodeURIComponent($page.url.pathname)}"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Mail class="w-4 h-4 mr-2" />
            Report Issue
          </a>
        </div>

        <!-- Additional Help for Portal Users -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500 mb-2">
            Portal Access Issues?
          </p>
          <ul class="text-xs text-gray-500 space-y-1">
            <li>• Ensure you're signed in with the correct Google account</li>
            <li>• Check that your account has the necessary permissions</li>
            <li>• Contact an administrator if the problem persists</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
