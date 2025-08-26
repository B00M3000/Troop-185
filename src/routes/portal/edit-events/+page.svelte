<script lang="ts">
  import {
    Edit,
    Calendar,
    MapPin,
    User,
    Plus,
    FileText,
    Trash2,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { notify } from "@/lib/utils/notifications";
  let deletingId = "";

  async function handleDeleteEvent(eventId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this event? This will also delete all associated images.",
      )
    )
      return;
    deletingId = eventId;
    try {
      const response = await fetch(`/portal/edit-events/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
      notify.success(`Event deleted! ${result.deletedImages} images removed.`);
      // Remove from local list
      events = events.filter((e) => e._id !== eventId);
    } catch (err) {
      notify.error("Failed to delete event.");
    } finally {
      deletingId = "";
    }
  }

  export let data;

  $: events = data.events || [];

  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Get status badge info
  function getStatusInfo(isDraft: boolean) {
    if (isDraft) {
      return {
        text: "Draft",
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    } else {
      return {
        text: "Published",
        class: "bg-green-100 text-green-800 border-green-200",
      };
    }
  }
</script>

<main class="bg-gray-50 min-h-screen py-8 px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Events</h1>
        <p class="text-gray-600">
          Select an event to edit its content and manage associated images.
        </p>
      </div>
      <button
        on:click={() => goto("/portal/create-event")}
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus class="w-5 h-5 mr-2" />
        Create New Event
      </button>
    </div>

    {#if events.length > 0}
      <!-- Events List -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each events as event (event._id)}
          <div
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <!-- Event Header -->
            <div class="p-6">
              <!-- Status Badge -->
              <div class="flex justify-between items-start mb-3">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border {getStatusInfo(
                    event.isDraft,
                  ).class}"
                >
                  {getStatusInfo(event.isDraft).text}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>

              <!-- Metadata -->
              <div class="space-y-2 mb-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <Calendar class="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDate(event.date)}</span>
                </div>

                {#if event.location}
                  <div class="flex items-center">
                    <MapPin class="w-4 h-4 mr-2 text-gray-400" />
                    <span class="line-clamp-1">{event.location}</span>
                  </div>
                {/if}

                <div class="flex items-center">
                  <User class="w-4 h-4 mr-2 text-gray-400" />
                  <span>Created by {event.createdBy.name}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->

            <div class="px-6 pb-6 flex gap-2">
              <button
                on:click={() => goto(`/portal/edit-events/${event._id}`)}
                class="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <Edit class="w-4 h-4 mr-2" />
                Edit Event
              </button>
              <button
                on:click={() => handleDeleteEvent(event._id)}
                class="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={deletingId === event._id}
                style="min-width: 110px"
              >
                {#if deletingId === event._id}
                  <span
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                  ></span>
                  Deleting...
                {:else}
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete
                {/if}
              </button>
            </div>

            <!-- Updated Date -->
            <div
              class="px-6 pb-4 text-xs text-gray-500 border-t border-gray-100 pt-4"
            >
              Last updated: {formatDate(event.updatedAt)}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- No Events Message -->
      <div class="text-center py-16">
        <div class="text-gray-400 mb-6">
          <FileText class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">
          No Events Available
        </h3>
        <p class="text-gray-500 mb-6">
          Create your first event to get started with managing troop activities.
        </p>
        <button
          on:click={() => goto("/portal/create-event")}
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-5 h-5 mr-2" />
          Create First Event
        </button>
      </div>
    {/if}
  </div>
</main>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
