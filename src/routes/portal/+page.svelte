<script lang="ts">
  import { User, Calendar, Award, FileText, Users, Settings } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-blue-800 mb-4">Troop 185 Portal</h1>
      <p class="text-lg text-gray-600">Welcome to your scouting dashboard</p>
    </div>

    <!-- Main Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Profile Card -->
      <a href="/portal/profile" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <User class="w-8 h-8 text-blue-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-blue-600">My Profile</h3>
        </div>
        <p class="text-gray-600">View and update your personal information, contact details, and emergency contacts.</p>
      </a>

      <!-- Events Card -->
      <a href="/portal/events" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <Calendar class="w-8 h-8 text-green-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-green-600">Events & Calendar</h3>
        </div>
        <p class="text-gray-600">View upcoming meetings, campouts, and troop activities. RSVP for events.</p>
      </a>

      <!-- Advancement Card -->
      <a href="/portal/advancement" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <Award class="w-8 h-8 text-yellow-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-yellow-600">Advancement</h3>
        </div>
        <p class="text-gray-600">Track your rank progress, merit badges, and advancement requirements.</p>
      </a>

      <!-- Documents Card -->
      <a href="/portal/documents" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <FileText class="w-8 h-8 text-purple-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-purple-600">Documents</h3>
        </div>
        <p class="text-gray-600">Access permission slips, medical forms, and important troop documents.</p>
      </a>

      <!-- Patrol Card -->
      <a href="/portal/patrol" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <Users class="w-8 h-8 text-red-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-red-600">My Patrol</h3>
        </div>
        <p class="text-gray-600">Connect with your patrol members and track patrol activities.</p>
      </a>

      <!-- Settings Card -->
      <a href="/portal/settings" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group">
        <div class="flex items-center mb-4">
          <Settings class="w-8 h-8 text-gray-600 mr-3" />
          <h3 class="text-xl font-semibold text-gray-800 group-hover:text-gray-600">Settings</h3>
        </div>
        <p class="text-gray-600">Manage your account settings, notifications, and preferences.</p>
      </a>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <a href="/portal/login" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Sign In
        </a>
        <a href="/portal/events" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
          View Events
        </a>
        <a href="/portal/advancement" class="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
          Check Progress
        </a>
        <a href="/" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          Back to Main Site
        </a>
      </div>
    </div>
  </div>
</div>
