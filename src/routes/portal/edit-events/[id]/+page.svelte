<script lang="ts">
  import {
    Upload,
    Calendar,
    MapPin,
    Eye,
    Edit3,
    Save,
    Image as ImageIcon,
    Trash2,
    Copy,
    Plus,
    ArrowLeft,
  } from "lucide-svelte";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import Markdown from "@/lib/Markdown.svelte";
  import { goto } from "$app/navigation";
  import { notify } from "@/lib/utils/notifications";

  // Props from page.server.ts
  export let data;

  // Form state - initialize with existing event data
  let eventTitle = data.event?.title || "";
  let eventDate = data.event?.date || "";
  let location = data.event?.location || "";
  let description = data.event?.body || "";

  // Image management
  let images = data.images || [];
  let isUploadingImage = false;
  let isDeletingImage = "";
  let isDeletingEvent = false;

  // Markdown preview state
  let showPreview = false;
  let isUploading = false;

  const eventId = data.event?._id;

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Convert image file to base64 data URL
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Handle file upload from file input
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    isUploadingImage = true;

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const dataUrl = await fileToDataUrl(file);

        // Upload image to server
        const response = await fetch(
          `/portal/edit-events/${eventId}/upload-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataUrl, filename: file.name }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();

        // Add to images list
        images = [
          {
            _id: result.imageId,
            filename: result.filename,
            type: file.type.split("/")[1],
            size: file.size,
            uploadedAt: new Date().toISOString(),
            url: `/images/${result.imageId}`,
          },
          ...images,
        ];
      }

      notify.success(`Successfully uploaded ${files.length} image(s)!`);

      // Reset the file input
      input.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      notify.error("Failed to upload image. Please try again.");
    } finally {
      isUploadingImage = false;
    }
  }

  // Copy markdown snippet to clipboard
  async function copyMarkdown(imageUrl: string, filename: string) {
    const markdown = `![${filename}](${imageUrl})`;

    try {
      await navigator.clipboard.writeText(markdown);
      notify.success("Markdown copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = markdown;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      notify.success("Markdown copied to clipboard!");
    }
  }

  // Delete image
  async function deleteImage(imageId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this image? This action cannot be undone.",
      )
    ) {
      return;
    }

    isDeletingImage = imageId;

    try {
      const response = await fetch(
        `/portal/edit-events/${eventId}/delete-image`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove from images list
      images = images.filter((img) => img._id !== imageId);

      notify.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      notify.error("Failed to delete image. Please try again.");
    } finally {
      isDeletingImage = "";
    }
  }

  // Convert markdown to HTML using marked and sanitize with DOMPurify
  function markdownToHtml(markdown: string): string {
    try {
      const rawHtml = marked(markdown) as string;
      // Sanitize the HTML to prevent XSS attacks
      return DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "strong",
          "em",
          "u",
          "s",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "a",
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "hr",
        ],
        ALLOWED_ATTR: ["href", "title", "alt", "src", "class", "id"],
        ALLOWED_URI_REGEXP:
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      });
    } catch (error) {
      console.error("Markdown parsing error:", error);
      return DOMPurify.sanitize(markdown.replace(/\n/g, "<br>"));
    }
  }

  // Handle form submission
  async function handleSubmit() {
    isUploading = true;

    try {
      // Prepare the data for submission
      const requestData = {
        eventTitle,
        eventDate,
        location: location || undefined,
        description,
      };

      console.log("Updating event:", requestData);

      // Send POST request to API endpoint
      const response = await fetch(`/portal/edit-events/${eventId}`, {
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

      notify.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);

      let errorMessage = "Failed to update event";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      notify.error(errorMessage);
    } finally {
      isUploading = false;
    }
  }

  // Handle event deletion
  async function handleDeleteEvent() {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone and will delete all associated images.",
      )
    ) {
      return;
    }

    isDeletingEvent = true;

    try {
      const response = await fetch(`/portal/edit-events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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

      notify.success(
        `Event deleted successfully! ${result.deletedImages} associated images were also removed.`,
      );

      // Navigate back to events list
      goto("/portal/edit-events");
    } catch (error) {
      console.error("Error deleting event:", error);

      let errorMessage = "Failed to delete event";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      notify.error(errorMessage);
    } finally {
      isDeletingEvent = false;
    }
  }

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<main class="bg-gray-50 h-full py-6 px-6 flex flex-col items-center justify-center overflow-y-auto overflow-hidden">
  <div class="max-w-[96rem] my-16">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="grid grid-cols-[1fr_auto_1fr] w-full space-x-4">
        <div class="flex justify-start items-center">
          <button
            on:click={() => goto("/portal/edit-events")}
            class="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Events
          </button>
        </div>
        <div class="flex flex-col items-center gap-1">
          <h1 class="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p class="text-gray-600 text-base">Manage event details and images</p>
        </div>
      </div>
    </div>

    <!-- Main Content - Side by Side Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <!-- Left Side - Event Form -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Event Details
          </h2>

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

            <!-- Event Date & Location -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., Camp Yawgoog"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Description with Markdown Support -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Body *
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      on:click={() => (showPreview = false)}
                      class="text-sm px-2 py-1 rounded {!showPreview
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'} flex items-center"
                    >
                      <Edit3 class="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      on:click={() => (showPreview = true)}
                      class="text-sm px-2 py-1 rounded {showPreview
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'} flex items-center"
                    >
                      <Eye class="w-3 h-3 mr-1" />
                      Preview
                    </button>
                  </div>
                </div>

                {#if !showPreview}
                  <!-- Markdown Editor -->
                  <div>
                    <textarea
                      id="description"
                      bind:value={description}
                      placeholder="Describe your event here using Markdown...\n\n**Bold text** and *italic text*\n# Headings\n- Bullet points\n1. Numbered lists\n[Links](https://example.com)\n![Images](image-url)\n\nUse the image manager on the right to upload images and copy their markdown!"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm h-144"
                      rows="10"
                      required
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                      Supports Markdown formatting. Upload images using the
                      manager on the right.
                    </p>
                  </div>
                {:else}
                  <!-- Markdown Preview -->
                  <div
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[240px] max-w-5xl"
                  >
                    <div class="prose prose-sm max-w-none">
                      {#if description.trim()}
                        <Markdown html={markdownToHtml(description)} />
                      {:else}
                        <p class="text-gray-400 italic">
                          Preview will appear here...
                        </p>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>

            <!-- Submit and Delete Buttons -->
            <div
              class="flex justify-between items-center space-x-4 pt-4 border-t border-gray-200"
            >
              <!-- Delete Button -->
              <button
                type="button"
                on:click={handleDeleteEvent}
                disabled={isDeletingEvent || isUploading}
                class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {#if isDeletingEvent}
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                  ></div>
                  Deleting...
                {:else}
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete Event
                {/if}
              </button>

              <!-- Update Button -->
              <button
                type="submit"
                disabled={isUploading || isDeletingEvent}
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {#if isUploading}
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                  ></div>
                  Updating...
                {:else}
                  <Save class="w-4 h-4 mr-2" />
                  Update Event
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Side - Image Management -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Image Manager</h2>
            <div class="text-sm text-gray-500">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </div>
          </div>

          <!-- Upload Area -->
          <div class="mb-6">
            <label for="imageUpload" class="block">
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors"
              >
                <div class="flex flex-col items-center">
                  {#if isUploadingImage}
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"
                    ></div>
                    <p class="text-sm text-gray-600">Uploading...</p>
                  {:else}
                    <Plus class="w-8 h-8 text-gray-400 mb-3" />
                    <p class="text-sm font-medium text-gray-900 mb-1">
                      Upload Images
                    </p>
                    <p class="text-xs text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  {/if}
                </div>
              </div>
            </label>
            <input
              id="imageUpload"
              type="file"
              multiple
              accept="image/*"
              on:change={handleFileUpload}
              class="hidden"
              disabled={isUploadingImage}
            />
          </div>

          <!-- Images List -->
          {#if images.length > 0}
            <div class="space-y-3 max-h-96 overflow-y-auto">
              {#each images as image (image._id)}
                <div
                  class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <!-- Thumbnail -->
                  <div class="shrink-0">
                    <img
                      src={image.url}
                      alt={image.filename}
                      class="w-12 h-12 rounded-md object-cover bg-gray-100"
                      loading="lazy"
                    />
                  </div>

                  <!-- File Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {image.url}
                    </p>
                    <div
                      class="flex items-center space-x-2 text-xs text-gray-500"
                    >
                      <span>{formatFileSize(image.size)}</span>
                      <span>•</span>
                      <span>{formatDate(image.uploadedAt)}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-1">
                    <button
                      on:click={() =>
                        copyMarkdown(image.url, image.filename || "image")}
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy Markdown"
                    >
                      <Copy class="w-4 h-4" />
                    </button>
                    <button
                      on:click={() => deleteImage(image._id)}
                      disabled={isDeletingImage === image._id}
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Image"
                    >
                      {#if isDeletingImage === image._id}
                        <div
                          class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"
                        ></div>
                      {:else}
                        <Trash2 class="w-4 h-4" />
                      {/if}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8">
              <ImageIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-500">No images uploaded yet</p>
              <p class="text-xs text-gray-400">
                Upload images to use in your event description
              </p>
            </div>
          {/if}

          <!-- Usage Instructions -->
          {#if images.length > 0}
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900 mb-2">
                Usage Instructions
              </h4>
              <p class="text-xs text-blue-700">
                Click the <Copy class="w-3 h-3 inline" /> icon next to any image
                to copy its Markdown code. Then paste it into your event description
                where you want the image to appear.
              </p>
            </div>
          {/if}

          <!-- Markdown Instructions -->
          <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">Markdown Formatting Guide</h3>
            <ul class="text-xs text-blue-800 list-disc pl-5 space-y-1">
              <li><strong>Headings:</strong> <code># H1</code>, <code>## H2</code>, <code>### H3</code></li>
              <li><strong>Bold:</strong> <code>**bold text**</code></li>
              <li><strong>Italic:</strong> <code>*italic text*</code></li>
              <li><strong>Lists:</strong> <code>- item</code> or <code>1. item</code></li>
              <li><strong>Links:</strong> <code>[title](https://example.com)</code></li>
              <li><strong>Images:</strong> <code>![alt text](image-url)</code> (use the image manager to copy image markdown)</li>
              <li><strong>Blockquote:</strong> <code>&gt; quoted text</code></li>
              <li><strong>Code:</strong> <code>`inline code`</code> or <code>```block code```</code></li>
              <li><strong>Horizontal Rule:</strong> <code>---</code></li>
              <li><strong>Tables:</strong> <code>| col1 | col2 |</code></li>
            </ul>
            <div class="mt-2">
              <a href="https://onlinemarkdown.com/syntax" target="_blank" rel="noopener" class="text-blue-700 underline text-xs">Full Markdown Syntax Reference</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
