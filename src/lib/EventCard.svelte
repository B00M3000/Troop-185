<script lang="ts">
  import { Calendar, MapPin, User } from 'lucide-svelte';
  import Markdown from '@/lib/Markdown.svelte';
  
  export let event: {
    id: string;
    title: string;
    date: string;
    location: string | null;
    body: string;
    createdBy: {
      name: string;
      email: string;
    };
    createdAt: string;
  };
  
  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Get first image from markdown for preview
  function getFirstImage(markdown: string): string | null {
    try {
      const imageMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch && imageMatch[1]) {
        const url = imageMatch[1].trim();
        // Validate URL before returning
        try {
          new URL(url);
          return url;
        } catch {
          console.warn('Invalid image URL found:', url);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting image from markdown:', error);
      return null;
    }
  }
  
  // Get excerpt from markdown (first paragraph or 150 characters)
  function getExcerpt(markdown: string): string {
    try {
      // Remove image markdown
      let text = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
      // Remove other markdown formatting
      text = text.replace(/[#*`_~]/g, '');
      // Get first paragraph or first 150 characters
      const firstParagraph = text.split('\n\n')[0];
      if (firstParagraph.length > 150) {
        return firstParagraph.substring(0, 147) + '...';
      }
      return firstParagraph;
    } catch (error) {
      console.error('Error extracting excerpt from markdown:', error);
      return 'Event details available...';
    }
  }
  
  const firstImage = getFirstImage(event.body);
  const excerpt = getExcerpt(event.body);
</script>

<div class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <!-- Event Image -->
  {#if firstImage}
    <div class="w-full h-48 overflow-hidden">
      <img 
        src={firstImage} 
        alt={event.title}
        class="w-full h-full object-cover"
        loading="lazy"
        on:error={(e) => {
          console.warn('Image failed to load:', firstImage);
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `
            <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div class="text-blue-600 text-center">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm font-medium">Image Unavailable</p>
              </div>
            </div>
          `;
        }}
      />
    </div>
  {:else}
    <!-- Placeholder if no image -->
    <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div class="text-blue-600 text-center">
        <Calendar class="w-12 h-12 mx-auto mb-2" />
        <p class="text-sm font-medium">Event Photo</p>
      </div>
    </div>
  {/if}

  <!-- Event Content -->
  <div class="p-6">
    <!-- Event Title -->
    <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
      {event.title}
    </h2>
    
    <!-- Event Details -->
    <div class="flex flex-col gap-2 mb-4 text-sm text-gray-600">
      <!-- Date -->
      <div class="flex items-center gap-2">
        <Calendar class="w-4 h-4" />
        <span>{formatDate(event.date)}</span>
      </div>
      
      <!-- Location -->
      {#if event.location}
        <div class="flex items-center gap-2">
          <MapPin class="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      {/if}
      
      <!-- Created By -->
      <div class="flex items-center gap-2">
        <User class="w-4 h-4" />
        <span>Posted by {event.createdBy.name}</span>
      </div>
    </div>
    
    <!-- Event Excerpt -->
    {#if excerpt}
      <div class="text-gray-700 text-sm mb-4 line-clamp-3">
        {excerpt}
      </div>
    {/if}
    
    <!-- View Details Link -->
    <div class="flex justify-between items-center">
      <a 
        href="/trips-events/{event.id}"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        View Details
      </a>
      
      <!-- Event Date Badge -->
      <span class="text-xs text-gray-500">
        {formatDate(event.createdAt)}
      </span>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
