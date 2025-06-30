<script lang="ts">
  import { enhance } from '$app/forms';

  export let form;

  
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm" method="POST" action="?/login" use:enhance>
    <h1 class="text-2xl font-bold mb-6 text-center text-blue-800">Login</h1>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={form?.email ?? ''}
        required
        autocomplete="username"
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
        autocomplete="current-password"
      />
    </div>

    {#if form?.error}
      <div class="mb-4 text-red-600 text-center">{form.error}</div>
    {/if}

    <div class="flex items-center justify-between">
      <button class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
        Login
      </button>
    </div>
  </form>
</div>
