<script lang="ts">
  // Resource subpages data
  const resources = [
    {
      title: 'New Enrollment',
      description: 'How to join Troop 185 and enrollment forms.',
      href: '/resources/new-enrollment',
      image: '/images/2024-troop-185-yellowstone-high-adventure-trip.png', // Placeholder
    },
    {
      title: 'FAQ',
      description: 'Frequently Asked Questions for new scouts and families.',
      href: '/resources/faq',
      image: '/images/2025-yawgoog-troop-185.png', // Placeholder
    },
    {
      title: 'Troop 185 Calendar',
      description: 'View the troop calendar and add it to your own.',
      href: '/resources/calendar',
      image: '/images/2019-08-23_16_17_10_mayflower_council_csp.jpg',
    },
    {
      title: 'Forms',
      description: 'Important forms and documents for scouts and families.',
      href: '/resources/forms',
      image: '/images/summer-2024-troop-185-yawgoog-scout-camp.png', // Placeholder
    },
    {
      title: 'Eagle Nest',
      description: 'Resources and materials for Eagle Scouts and candidates.',
      href: '/resources/eagle-nest',
      image: '/images/eagle-scout-badge.png', 
    },
    {
      title: 'Troop Adult Leaders',
      description: 'Meet the Troop 185 adult leadership team.',
      href: '/resources/troop-adult-leaders',
      image: '/logo.png', // Placeholder
    },
    {
      title: 'Troop Cookbook',
      description: 'Troop 185s favorite camping recipies',
      href: '/cookbook',
      image: '/images/pot_of_fire.jpg',
    },
    {
      description: 'Renew national membership, view your scoutbook, and more.',
      href: 'https://www.scouting.org/',
      image: '/images/scouting-usa-logo.png', // Placeholder
    }
  ];
</script>

<h1 class="text-4xl font-extrabold mb-8 text-blue-800 text-center mt-8">Troop 185 - Scouting Resources Hub</h1>
<div class="flex flex-wrap gap-8 justify-center p-8 md:p-16">
  {#each resources as resource}
    <a href={resource.href} class="w-full lg:w-80 xl:w-96 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center p-6 mb-4">
      <img src={resource.image} alt={resource.title} class="rounded mb-4 w-56 h-32 object-contain" />
      <h2 class="text-xl font-bold mb-2 text-blue-700 text-center">{resource.title}</h2>
      <p class="text-gray-700 text-center mb-2">{resource.description}</p>
    </a>
  {/each}
</div>
