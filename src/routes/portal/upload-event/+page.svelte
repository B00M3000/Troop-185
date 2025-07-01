<script lang="ts">
  import { Upload, Calendar, MapPin, Users, Eye, Edit3 } from 'lucide-svelte';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import Markdown from '@/lib/Markdown.svelte';
  
  // Form state
  let eventTitle = '';
  let eventDate = '';
  let location = '';
  let participants = '';
  let description = '';
  
  // Image alias storage - maps aliases to base64 data URLs
  let imageAliases: Record<string, string> = {};
  let imageCounter = 0;
  
  // Markdown preview state
  let showPreview = false;
  let isUploading = false;
  
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  // Handle file upload - removed as we're now doing inline pasting
  
  // Convert image file to base64 data URL
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  // Handle paste events for images in markdown editor
  async function handleMarkdownPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    
    const items = Array.from(clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length > 0) {
      event.preventDefault();
      
      // Get the textarea element
      const textarea = event.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;
      
      // Process each image
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          try {
            const dataUrl = await fileToDataUrl(file);
            
            // Create a unique alias for this image
            imageCounter++;
            const alias = `%image-${imageCounter}%`;
            const fileName = `pasted-image-${imageCounter}.${file.type.split('/')[1]}`;
            
            // Store the data URL with the alias
            imageAliases[alias] = dataUrl;
            
            // Use alias in markdown instead of full data URL
            const markdownImage = `![${fileName}](${alias})`;
            
            // Insert the markdown image at cursor position
            const before = description.substring(0, cursorPosition);
            const after = description.substring(cursorPosition);
            description = before + markdownImage + '\n\n' + after;
            
            // Update cursor position after the inserted image
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = cursorPosition + markdownImage.length + 2;
              textarea.focus();
            }, 0);
          } catch (error) {
            console.error('Error processing pasted image:', error);
          }
        }
      }
    }
  }
  
  // Replace image aliases with actual data URLs for preview/submission
  function replaceImageAliases(markdown: string): string {
    let processedMarkdown = markdown;
    
    // Replace all image aliases with their corresponding data URLs
    Object.entries(imageAliases).forEach(([alias, dataUrl]) => {
      const aliasRegex = new RegExp(`\\(${alias}\\)`, 'g');
      processedMarkdown = processedMarkdown.replace(aliasRegex, `(${dataUrl})`);
    });
    
    return processedMarkdown;
  }
  
  // Convert markdown to HTML using marked and sanitize with DOMPurify
  function markdownToHtml(markdown: string): string {
    try {
      // Replace image aliases with actual data URLs before processing
      const processedMarkdown = replaceImageAliases(markdown);
      const rawHtml = marked(processedMarkdown) as string;
      // Sanitize the HTML to prevent XSS attacks
      return DOMPurify.sanitize(rawHtml, {
        // Allow common HTML elements for rich text
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's',
          'ul', 'ol', 'li',
          'blockquote', 'code', 'pre',
          'a', 'img',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'hr'
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'src',
          'class', 'id'
        ],
        // Only allow HTTP(S) and mailto links
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      });
    } catch (error) {
      console.error('Markdown parsing error:', error);
      // Sanitize plain text fallback as well
      return DOMPurify.sanitize(markdown.replace(/\n/g, '<br>'));
    }
  }
  
  // Handle form submission
  async function handleSubmit() {
    isUploading = true;
    
    // TODO: Implement actual upload logic
    console.log('Uploading event:', {
      eventTitle,
      eventDate,
      location,
      participants,
      description: replaceImageAliases(description), // Replace aliases before submission
      imageAliases // Also log the alias mapping for debugging
    });
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    isUploading = false;
    
    // TODO: Show success message and redirect
    alert('Event uploaded successfully!');
  }
</script>

<main class="bg-gray-50 py-8 px-4 overflow-y-auto">
  <div class="max-w-[64rem] mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Upload Trip/Event</h1>
      <p class="text-gray-600">Share photos and memories from recent trips, campouts, and troop activities.</p>
    </div>

    <!-- Upload Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6 flex flex-col gap-6">
        <!-- Event Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="date" class="text-sm font-medium text-gray-700 mb-2 flex items-center">
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
            <label for="location" class="text-sm font-medium text-gray-700 mb-2 flex items-center">
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
        </div>

        <!-- Description with Markdown Support -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Body *
            </label>
            <div class="flex items-center space-x-2 gap-2">
              <button
                type="button"
                on:click={() => showPreview = false}
                class="text-sm px-2 gap-2 py-2 rounded {!showPreview ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'} flex items-center"
              >
                <Edit3 class="w-3 h-3 mr-1" />
                Edit
              </button>
              <button
                type="button"
                on:click={() => showPreview = true}
                class="text-sm px-2 py-2 gap-2 rounded {showPreview ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'} flex items-center"
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
                on:paste={handleMarkdownPaste}
                placeholder="Describe your event here... 

You can use Markdown formatting:

# Large Heading
## Medium Heading  
### Small Heading

**Bold text** and *italic text*

> This is a blockquote for important notes

* Bullet point
* Another bullet point
  * Nested bullet point

1. Numbered list
2. Another item
   1. Nested numbered item

`inline code` for technical terms

```
code block for longer code examples
```

[Link text](https://example.com)

![Alt text](image-url) - You can also paste images directly (Ctrl+V / Cmd+V)

---

Use horizontal rules to separate sections"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows="12"
                required
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Supports full Markdown: **bold**, *italic*, # headings, * lists, > quotes, `code`, [links](url). Paste images directly (Ctrl+V / Cmd+V)
              </p>
            </div>
          {:else}
            <!-- Markdown Preview -->
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[300px]">
              <div class="prose prose-sm max-w-none">
                {#if description.trim()}
                  <Markdown html={markdownToHtml(description)} />
                {:else}
                  <p class="text-gray-400 italic">Preview will appear here...</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            on:click={() => history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {#if isUploading}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            {:else}
              <Upload class="w-4 h-4 mr-2" />
              Upload Event
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</main>
