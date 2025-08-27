<script lang="ts">
  import { Calendar, MapPin, User, ArrowLeft } from 'lucide-svelte';
  import Markdown from '@/lib/Markdown.svelte';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: event = data.event;
  
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  // Convert markdown to HTML using marked and sanitize with DOMPurify
  function markdownToHtml(markdown: string): string {
    try {
      const rawHtml = marked(markdown) as string;
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
  
  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>{event.title} - Troop 185</title>
  <meta name="description" content="Event details for {event.title}" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-5xl mx-auto py-8 px-6">
    <!-- Back Button -->
    <div class="mb-6">
      <a 
        href="/trips-events"
        class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Events
      </a>
    </div>

    <!-- Event Header -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Event Title Section -->
      <div class="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 class="text-3xl font-bold mb-4">{event.title}</h1>
        
        <!-- Event Meta Information -->
        <div class="flex flex-wrap gap-6 text-blue-100">
          <!-- Date -->
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5" />
            <span class="font-medium">{formatDate(event.date)}</span>
          </div>
          
          <!-- Location -->
          {#if event.location}
            <div class="flex items-center gap-2">
              <MapPin class="w-5 h-5" />
              <span class="font-medium">{event.location}</span>
            </div>
          {/if}
          
          <!-- Posted by -->
          <div class="flex items-center gap-2">
            <User class="w-5 h-5" />
            <span class="font-medium">Posted by {event.createdBy.name}</span>
          </div>
        </div>
        
        <!-- Posted date -->
        <div class="mt-4 text-blue-200 text-sm">
          Posted on {formatDateTime(event.createdAt)}
        </div>
      </div>

      <!-- Event Content -->
      <div class="p-8">
        <div class="prose prose-lg max-w-none">
          <Markdown html={markdownToHtml(event.body)} />
        </div>
      </div>
    </div>

    <!-- Additional Actions/Links (if needed in the future) -->
    <div class="mt-8 text-center">
      <a 
        href="/trips-events"
        class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
      >
        View More Events
      </a>
    </div>
  </div>
</div>
