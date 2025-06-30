<script lang="ts">
  import { ArrowLeft, User } from 'lucide-svelte';

  let { children, data } = $props();

  // Mock user data - in real app this would come from locals or store
  const user = {
    name: "John Smith"
  };
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Portal Navbar -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
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

        <!-- Right side - User info -->
        <div class="flex items-center">
          <div class="flex items-center text-gray-700">
            <User class="w-5 h-5 mr-2 text-gray-500" />
            <span class="font-medium">{data.user.name}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Page content -->
  <main>
    {@render children()}
  </main>
</div>
