<script lang="ts">
  import { signIn } from '@auth/sveltekit/client'
  import { page } from '$app/stores'

  const handleGoogleSignIn = () => {
    signIn('google', {
      redirectTo: '/portal',
      redirect: true
    })
  }

  // Get error from URL params
  $: error = $page.url.searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'There was an error while logging you in (A database entry already exists for this email, but it was not linked through Auth.js). Please contact the webmaster.'
      case 'OAuthCallbackError':
        return 'Authentication failed during the Google sign-in process. This could be due to a network issue, cancelled authorization, or temporary Google service problem. Please check your internet connection and try again.'
      case 'Configuration':
        return 'There is a server configuration issue preventing sign-in (missing environment variables or database connection problems). Please contact the troop webmaster or administrator for assistance.'
      case 'AccessDenied':
        return 'Access was denied during Google sign-in. This happens when you cancel the Google authorization or deny permission. Please try signing in again and authorize the application.'
      case 'Verification':
        return 'Email verification failed. This can happen if the verification link expired or was already used. Please try signing in again to receive a new verification.'
      case 'Default':
        return 'An unexpected authentication error occurred. Please try refreshing the page and signing in again. If the problem persists, contact the troop webmaster.'
      default:
        return error ? `An authentication error occurred: "${error}". Please try again or contact the troop webmaster if the problem persists.` : null
    }
  }
</script>

<div class="flex items-center justify-center h-full pb-8 bg-gray-50">
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
    <h1 class="text-2xl font-bold mb-6 text-center text-blue-800">
      Troop 185 Portal Login
    </h1>

    <div class="mb-6 text-center text-gray-600 text-sm">
      Sign in with your Google account to access the Troop 185 portal
    </div>

    {#if error}
      <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {getErrorMessage(error)}
      </div>
    {/if}

    <button
      onclick={handleGoogleSignIn}
      class="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex items-center justify-center gap-3"
    >
      <!-- Google Logo SVG -->
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    </button>

    <div class="mt-6 text-center text-xs text-gray-500">
      By signing in, you agree to access the Troop 185 portal using your Google account.
      Contact troop leadership if you need assistance.
    </div>
  </div>
</div>
