<script lang="ts">
  import { onMount } from 'svelte';
  let events: any[] = [];

  // Mock data fetch for events (replace with actual API if needed)
  onMount(() => {
    events = [
      { id: 1, title: 'Camping Trip', date: '2024-01-15', description: 'Join us for an exciting camping adventure!' },
      { id: 2, title: 'Fundraiser Event', date: '2024-02-10', description: 'Support our troop by attending this event.' },
    ];
  });
</script>

<div class="container mx-auto px-4 py-8">
  <header class="text-center mb-12">
    <h1 class="text-4xl font-bold text-gray-800">Welcome to Troop 185</h1>
    <p class="mt-4 text-lg text-gray-600">
      Your source for scouting events, updates, and community!
    </p>
  </header>

  <section class="mb-12">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Upcoming Events</h2>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each events as event}
        <div class="bg-white rounded-lg shadow-md p-4">
          <h3 class="text-xl font-bold text-gray-800">{event.title}</h3>
          <p class="text-gray-500 text-sm">{event.date}</p>
          <p class="mt-2 text-gray-600">{event.description}</p>
        </div>
      {/each}
    </div>
  </section>
</div>
