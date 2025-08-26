<script lang="ts">
  import { Calendar, MapPin, ArrowRight } from "lucide-svelte";
  import { goto } from "$app/navigation";

  // Form state
  let eventTitle = "";
  let eventDate = "";
  let location = "";
  let isCreating = false;

  // Handle form submission
  async function handleSubmit() {
    isCreating = true;

    try {
      // Prepare the data for preliminary submission
      const requestData = {
        eventTitle,
        eventDate,
        location: location || undefined,
      };

      console.log("Creating preliminary event:", requestData);

      // Send POST request to API endpoint
      const response = await fetch("/portal/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const result = await response.json();

      // Navigate to the new edit page with the created event ID
      goto(`/portal/edit-events/${result.eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);

      // Show user-friendly error message
      let errorMessage = "Failed to create event";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      isCreating = false;
    }
  }
</script>

<main class="bg-gray-50 py-8 px-8 overflow-y-auto">
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8 mt-16">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
      <p class="text-gray-600">
        Start by entering the basic information about your event. You'll be able
        to add photos and detailed descriptions in the next step.
      </p>
    </div>

    <!-- Preliminary Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Event Title -->
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            bind:value={eventTitle}
            placeholder="e.g., Summer Camp 2024, Hiking Trip to Mount Washington"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Event Date -->
        <div>
          <label
            for="date"
            class="text-sm font-medium text-gray-700 mb-2 flex items-center"
          >
            <Calendar class="w-4 h-4 mr-2" />
            Event Date *
          </label>
          <input
            id="date"
            type="date"
            bind:value={eventDate}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Location -->
        <div>
          <label
            for="location"
            class="text-sm font-medium text-gray-700 mb-2 flex items-center"
          >
            <MapPin class="w-4 h-4 mr-2" />
            Location
          </label>
          <input
            id="location"
            type="text"
            bind:value={location}
            placeholder="e.g., Camp Yawgoog, Mount Washington State Park"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            on:click={() => history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {#if isCreating}
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              Creating...
            {:else}
              Continue to Editor
              <ArrowRight class="w-4 h-4 ml-2" />
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</main>
