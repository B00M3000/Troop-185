<script lang="ts">
  import {
    User,
    Calendar,
    Award,
    FileText,
    Users,
    Settings,
    Upload,
    Database,
  } from "lucide-svelte";

  let { data } = $props();

  let { session } = data;

  // Role flags for bitwise operations
  const ROLES = {
    SCOUT: 1, // 0001
    ADULT: 2, // 0010
    ADMIN: 4, // 0100
    UNASSIGNED: 8, // 1000
  } as const;

  // Helper function to check if user has required roles
  function hasRequiredRole(
    userRole: string | undefined,
    requiredRoles: number,
  ): boolean {
    if (!userRole) return requiredRoles & ROLES.UNASSIGNED;
    const roleFlag = ROLES[userRole as keyof typeof ROLES];
    return roleFlag ? (requiredRoles & roleFlag) !== 0 : false;
  }

  // Portal cards data with role-based access control
  let portalCards = [
    {
      id: "events",
      title: "Events & Calendar",
      description: "View and manage troop events and calendar.",
      icon: Calendar,
      color: "green",
      href: "/resources/calendar",
      isActive: true,
      allowedRoles: ROLES.UNASSIGNED | ROLES.SCOUT | ROLES.ADULT | ROLES.ADMIN,
    },
    {
      id: "documents",
      title: "Documents",
      description: "Access troop documents and forms.",
      icon: FileText,
      color: "purple",
      href: "#",
      isActive: false,
      allowedRoles: ROLES.UNASSIGNED | ROLES.SCOUT | ROLES.ADULT | ROLES.ADMIN,
    },
    {
      id: "patrol",
      title: "My Patrol",
      description: "Connect with your patrol members.",
      icon: Users,
      color: "indigo",
      href: "#",
      isActive: false,
      allowedRoles: ROLES.SCOUT, // Only scouts
    },
    {
      id: "edit-events",
      title: "Event Management",
      description: "Create and manage troop events and activities.",
      icon: Upload,
      color: "red",
      href: "/portal/edit-events",
      isActive: true,
      allowedRoles: ROLES.ADMIN, // Only admins
    },
    {
      id: "user-management",
      title: "User Management",
      description: "Manage users.",
      icon: Users,
      color: "gray",
      href: "/portal/user-management",
      isActive: true,
      allowedRoles: ROLES.ADMIN, // Only admins
    },
  ];

  // Color variant maps for static class names
  const colorVariants = {
    blue: {
      icon: "text-blue-600",
      hover: "group-hover:text-blue-600",
    },
    green: {
      icon: "text-green-600",
      hover: "group-hover:text-green-600",
    },
    purple: {
      icon: "text-purple-600",
      hover: "group-hover:text-purple-600",
    },
    indigo: {
      icon: "text-indigo-600",
      hover: "group-hover:text-indigo-600",
    },
    red: {
      icon: "text-red-600",
      hover: "group-hover:text-red-600",
    },
    yellow: {
      icon: "text-yellow-600",
      hover: "group-hover:text-yellow-600",
    },
    gray: {
      icon: "text-gray-600",
      hover: "group-hover:text-gray-600",
    },
  };

  // Filter cards based on user's role
  let visibleCards = $derived(
    portalCards.filter((card) =>
      hasRequiredRole(session.user.role, card.allowedRoles),
    ),
  );
</script>

<main class="bg-gray-50 py-8 px-8 flex flex-col overflow-y-auto">
  <div class="max-w-7xl mx-auto flex flex-col items-center">
    <!-- Header -->
    <div class="text-center mb-12 mt-8 md:mt-16">
      <!-- Welcome Section with User Info -->
      <div class="flex max-md:flex-col items-center justify-center mb-6 gap-4">
        <img
          src={session.user.image}
          alt="User Avatar"
          class="w-32 h-32 rounded-full border-4 border-blue-200 mr-4"
        />
        <div class="text-center md:text-left flex flex-col gap-2">
          <h2 class="text-4xl font-semibold text-gray-800">
            Welcome back, {session.user.name}!
          </h2>
          <p class="text-gray-600 text-xl">Ready for your next adventure?</p>
        </div>
      </div>
    </div>

    <!-- Main Navigation Cards -->
    <div class="flex flex-wrap gap-6 mb-8 items-center justify-center">
      {#each visibleCards as card (card.id)}
        {#if card.isActive}
          <!-- Active Card -->
          <a
            href={card.href}
            class="w-96 h-64 bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 hover:scale-105 block group"
            data-sveltekit-preload-data
          >
            <div class="flex items-center mb-4">
              <card.icon
                class="w-8 h-8 {colorVariants[card.color]?.icon ||
                  'text-gray-600'} mr-3"
              />
              <h3
                class="text-xl font-semibold text-gray-800 {colorVariants[
                  card.color
                ]?.hover || 'group-hover:text-gray-600'}"
              >
                {card.title}
              </h3>
            </div>
            <p class="text-gray-600">{card.description}</p>
          </a>
        {:else}
          <!-- Placeholder Card -->
          <div
            class="w-96 h-64 bg-gray-100 rounded-lg shadow-md p-6 opacity-60 cursor-not-allowed"
          >
            <div class="flex items-center mb-4">
              <card.icon class="w-8 h-8 text-gray-400 mr-3" />
              <h3 class="text-xl font-semibold text-gray-500">{card.title}</h3>
            </div>
            <p class="text-gray-400">{card.description}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</main>
