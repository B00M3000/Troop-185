<script lang="ts">
  import { page } from '$app/stores';
  import { Home, Mail, RefreshCw, ArrowLeft } from 'lucide-svelte';
  
  let { error }: { error: App.Error } = $props();
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <!-- Error Icon -->
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
        <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 8.5c-.77.833-.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <!-- Error Content -->
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>
        
        <p class="text-sm text-gray-600 mb-6">
          We're sorry, but there was an error processing your request.
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
            href="/"
            class="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home class="w-4 h-4 mr-2" />
            Return to Home
          </a>
          
          <button
            onclick={() => window.location.reload()}
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <a
            href="mailto:webmaster@mytroop185.com?subject=Website Error&body=I encountered an error on the website.%0A%0AError: {encodeURIComponent(error?.message || 'Unknown error')}%0APage: {encodeURIComponent($page.url.pathname)}"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Mail class="w-4 h-4 mr-2" />
            Contact Webmaster
          </a>
          
          <button
            onclick={() => window.history.back()}
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <!-- Additional Help -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            If this problem persists, please try:
          </p>
          <ul class="text-xs text-gray-500 mt-2 space-y-1">
            <li>• Clearing your browser cache</li>
            <li>• Checking your internet connection</li>
            <li>• Trying again in a few minutes</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
