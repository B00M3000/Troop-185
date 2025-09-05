<script lang="ts">
  import EventCard from '@/lib/EventCard.svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: events = data.events || [];
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6 text-blue-800">Trips & Events</h1>
  <p class="mb-8 text-lg text-gray-700">Find trip reports, packing lists, and more for recent and upcoming Troop 185 adventures.</p>
  
  {#if events.length > 0}
    <!-- Events Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each events as event (event.id)}
        <EventCard {event} />
      {/each}
    </div>
  {:else}
    <!-- No Events Message -->
    <div class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
      <p class="text-gray-500">Check back soon for upcoming trips and activities!</p>
    </div>
  {/if}
</div>
