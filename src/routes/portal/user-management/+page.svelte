<script lang="ts">
  import { Users, Shield, Clock, Calendar, Key, Monitor, RotateCcw, AlertTriangle, CheckCircle, X, ArrowRight, FileText, Loader2 } from 'lucide-svelte';
  import { enhance } from '$app/forms';
  import { fade, slide } from 'svelte/transition';
  import { invalidate } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import RoleBadge from '@/lib/RoleBadge.svelte';
  import { notify } from '@/lib/utils/notifications';
  
  let { data, form } = $props();

  let activeTab: 'users' | 'sessions' | 'accounts' = $state('users');
  let selectedUser: any = $state(null);
  let showConfirmDialog = $state(false);
  let showAnnotationModal = $state(false);
  let confirmAction: any = $state(null);
  let annotationText = $state('');
  let isLoading = $state(false);
  let isRefreshing = $state(false);
  
  // Auto-refresh setup
  let refreshInterval: NodeJS.Timeout;
  
  // Start auto-refresh on mount
  $effect(() => {
    refreshInterval = setInterval(async () => {
      isRefreshing = true;
      try {
        await invalidate('user-management:data');
      } finally {
        // Show refresh indicator for at least 500ms for visual feedback
        setTimeout(() => {
          isRefreshing = false;
        }, 500);
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  });
  
  // Manual refresh function
  async function manualRefresh() {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    isRefreshing = true;
    try {
      await invalidate('user-management:data');
      notify.success('Data refreshed successfully');
    } catch (error) {
      notify.error('Failed to refresh data');
    } finally {
      setTimeout(() => {
        isRefreshing = false;
      }, 500);
    }
  }

  // Clean up on destroy
  onDestroy(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
  
  // Format date helper
  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Handle role change confirmation
  function confirmRoleChange(user: any, newRole: string) {
    selectedUser = user;
    confirmAction = {
      type: 'roleChange',
      newRole,
      message: `Change ${user.name}'s role to ${newRole}?`
    };
    showConfirmDialog = true;
  }

  // Reset dropdown when action is canceled
  function cancelAction() {
    // Reset any dropdowns to their original values
    if (confirmAction?.type === 'roleChange' && selectedUser) {
      const dropdown = document.querySelector(`select[data-user-id="${selectedUser._id}"]`) as HTMLSelectElement;
      if (dropdown) {
        dropdown.value = selectedUser.role;
      }
    }
    
    showConfirmDialog = false;
    selectedUser = null;
    confirmAction = null;
  }

  // Handle session revocation confirmation
  function confirmRevokeAllSessions(user: any) {
    selectedUser = user;
    confirmAction = {
      type: 'revokeSessions',
      message: `Revoke all sessions for ${user.name}? This will sign them out of all devices.`
    };
    showConfirmDialog = true;
  }

  // Handle annotation modal
  function openAnnotationModal(user: any) {
    selectedUser = user;
    annotationText = user.annotation || '';
    showAnnotationModal = true;
  }

  // Handle annotation save (direct submission)
  function saveAnnotation() {
    if (!selectedUser || !annotationForm) return;
    
    isLoading = true;
    const userIdInput = annotationForm.querySelector('input[name="userId"]') as HTMLInputElement;
    const annotationTextarea = annotationForm.querySelector('textarea[name="annotation"]') as HTMLTextAreaElement;
    userIdInput.value = selectedUser._id;
    annotationTextarea.value = annotationText;
    annotationForm.requestSubmit();
  }

  // Handle form submission for role changes
  let roleChangeForm: HTMLFormElement | undefined = $state();
  let sessionRevokeForm: HTMLFormElement | undefined = $state();
  let annotationForm: HTMLFormElement | undefined = $state();

  function executeAction() {
    if (confirmAction?.type === 'roleChange' && roleChangeForm) {
      const roleInput = roleChangeForm.querySelector('input[name="role"]') as HTMLInputElement;
      const userIdInput = roleChangeForm.querySelector('input[name="userId"]') as HTMLInputElement;
      roleInput.value = confirmAction.newRole;
      userIdInput.value = selectedUser._id;
      roleChangeForm.requestSubmit();
    } else if (confirmAction?.type === 'revokeSessions' && sessionRevokeForm) {
      const userIdInput = sessionRevokeForm.querySelector('input[name="userId"]') as HTMLInputElement;
      userIdInput.value = selectedUser._id;
      sessionRevokeForm.requestSubmit();
    }
    showConfirmDialog = false;
    selectedUser = null;
    confirmAction = null;
  }

  function closeAnnotationModal() {
    showAnnotationModal = false;
    selectedUser = null;
    annotationText = '';
    isLoading = false;
  }

  function cancelAnnotationModal() {
    // Reset annotation text to original value
    if (selectedUser) {
      annotationText = selectedUser.annotation || '';
    }
    closeAnnotationModal();
  }

  // Watch for form updates and handle notifications
  $effect(() => {
    if (form?.success) {
      notify.success(form.message || 'Action completed successfully');
      if (isLoading) {
        closeAnnotationModal();
      }
    } else if (form?.error) {
      notify.error(form.error);
      if (isLoading) {
        isLoading = false;
      }
    }
  });
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p class="text-gray-600">Manage user roles and view session information</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="text-xs text-gray-500">
          Auto-refreshing every 10s
        </div>
        <button
          type="button"
          onclick={manualRefresh}
          disabled={isRefreshing}
          class="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh data manually"
        >
          <RotateCcw class="w-4 h-4 mr-1 {isRefreshing ? 'animate-spin' : ''}" />
          Refresh
        </button>
        
      </div>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="border-b border-gray-200 mb-6">
    <nav class="-mb-px flex space-x-8">
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        onclick={() => activeTab = 'users'}
      >
        <Users class="w-4 h-4 inline mr-2" />
        Users ({data.users.length})
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'sessions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        onclick={() => activeTab = 'sessions'}
      >
        <Monitor class="w-4 h-4 inline mr-2" />
        Sessions ({data.sessions.length})
      </button>
      <button
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'accounts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        onclick={() => activeTab = 'accounts'}
      >
        <Key class="w-4 h-4 inline mr-2" />
        Google Accounts ({data.accounts.length})
      </button>
    </nav>
  </div>

  <!-- Users Tab -->
  {#if activeTab === 'users'}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        {#each data.users as user (user._id)}
          <li class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <!-- User Avatar -->
                <div class="flex-shrink-0 h-12 w-12">
                  {#if user.image}
                    <img class="h-12 w-12 rounded-full" src={user.image} alt="{user.name}" />
                  {:else}
                    <div class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <Users class="h-6 w-6 text-gray-600" />
                    </div>
                  {/if}
                </div>
                
                <!-- User Info -->
                <div class="ml-4">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                    <div class="ml-2">
                      <RoleBadge role={user.role} size="md" />
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">{user.email}</div>
                  <div class="text-xs text-gray-400 flex items-center mt-1">
                    <Clock class="w-3 h-3 mr-1" />
                    Last active: {formatDate(user.lastActive)}
                  </div>
                </div>
                
                <!-- Annotation Display (Center) -->
                <div class="flex-1 px-4 ml-4 hidden sm:block">
                  {#if user.annotation}
                    <div class="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                      <div class="flex items-center mb-1">
                        <FileText class="w-3 h-3 mr-1 text-blue-500" />
                        <span class="font-medium">Note:</span>
                      </div>
                      <p class="italic leading-relaxed">{user.annotation}</p>
                    </div>
                  {/if}
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex items-center space-x-2 flex-shrink-0">
                <!-- Role Change Dropdown -->
                <div class="relative">
                  <select 
                    class="block w-24 sm:w-32 pl-2 sm:pl-3 pr-8 sm:pr-10 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={user.role}
                    data-user-id={user._id}
                    onchange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      const newRole = target.value;
                      if (newRole !== user.role) {
                        confirmRoleChange(user, newRole);
                      }
                    }}
                  >
                    <option value="UNASSIGNED">Unassigned</option>
                    <option value="SCOUT">Scout</option>
                    <option value="ADULT">Adult</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <!-- Annotation Button -->
                <button
                  type="button"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors {user.annotation ? 'text-blue-500' : ''}"
                  title={user.annotation ? 'Edit annotation' : 'Add annotation'}
                  onclick={() => openAnnotationModal(user)}
                >
                  <FileText class="w-4 h-4" />
                </button>

                <!-- Revoke All Sessions Button -->
                <button
                  type="button"
                  class="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                  title="Revoke all sessions"
                  onclick={() => confirmRevokeAllSessions(user)}
                >
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Additional user details -->
            <div class="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-4">
              <div class="flex items-center">
                <Calendar class="w-3 h-3 mr-1" />
                Joined: {formatDate(user.createdAt)}
              </div>
              <div class="flex items-center">
                <Clock class="w-3 h-3 mr-1" />
                Updated: {formatDate(user.updatedAt)}
              </div>
            </div>

            <!-- Mobile Annotation Display -->
            <div class="mt-2 sm:hidden">
              {#if user.annotation}
                <div class="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                  <div class="flex items-center mb-1">
                    <FileText class="w-3 h-3 mr-1 text-blue-500" />
                    <span class="font-medium">Note:</span>
                  </div>
                  <p class="italic leading-relaxed">{user.annotation}</p>
                </div>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Sessions Tab (Read-only) -->
  {#if activeTab === 'sessions'}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
        <p class="text-sm text-yellow-800">
          <AlertTriangle class="w-4 h-4 inline mr-1" />
          Sessions are managed by Auth.js and are read-only here. Use the "Revoke all sessions" button in the Users tab to sign out users.
        </p>
      </div>
      <ul class="divide-y divide-gray-200">
        {#each data.sessions as session (session._id)}
          <li class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-900">Session ID: {session._id}</div>
                <div class="text-sm text-gray-500">User: {session.userEmail || 'Unknown'}</div>
                <div class="text-xs text-gray-400">
                  Expires: {formatDate(session.expires)}
                </div>
              </div>
              <div class="text-xs text-gray-400">
                {#if session.sessionToken}
                  Token: {session.sessionToken.substring(0, 20)}...
                {:else}
                  Session ID: {session._id}
                {/if}
              </div>
            </div>
          </li>
        {/each}
        {#if data.sessions.length === 0}
          <li class="px-6 py-8 text-center text-gray-500">
            No active sessions found
          </li>
        {/if}
      </ul>
    </div>
  {/if}

  <!-- Accounts Tab (Read-only) -->
  {#if activeTab === 'accounts'}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-6 py-3 bg-blue-50 border-b border-blue-200">
        <p class="text-sm text-blue-800">
          <Key class="w-4 h-4 inline mr-1" />
          Google OAuth accounts are managed by Auth.js and are read-only here.
        </p>
      </div>
      <ul class="divide-y divide-gray-200">
        {#each data.accounts as account (account._id)}
          <li class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-900">Provider: {account.provider}</div>
                <div class="text-sm text-gray-500">Email: {account.userEmail}</div>
                <div class="text-xs text-gray-400">
                  Provider Account ID: {account.providerAccountId}
                </div>
              </div>
              <div class="text-xs text-gray-400">
                Type: {account.type}
              </div>
            </div>
          </li>
        {/each}
        {#if data.accounts.length === 0}
          <li class="px-6 py-8 text-center text-gray-500">
            No accounts found
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</main>

<!-- Hidden Forms for Actions -->
<form bind:this={roleChangeForm} method="POST" action="?/updateUserRole" use:enhance style="display: none;">
  <input type="hidden" name="userId" />
  <input type="hidden" name="role" />
</form>

<form bind:this={sessionRevokeForm} method="POST" action="?/revokeAllSessions" use:enhance style="display: none;">
  <input type="hidden" name="userId" />
</form>

<form bind:this={annotationForm} method="POST" action="?/updateUserAnnotation" use:enhance style="display: none;">
  <input type="hidden" name="userId" />
  <textarea name="annotation" style="display: none;"></textarea>
</form>

<!-- Confirmation Modal -->
{#if showConfirmDialog}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" transition:fade>
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <AlertTriangle class="mx-auto h-12 w-12 text-yellow-400" />
        <h3 class="text-lg font-medium text-gray-900 mt-2">Confirm Action</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            {confirmAction?.message}
          </p>
          {#if confirmAction?.type === 'roleChange' && selectedUser}
            <div class="flex items-center justify-center gap-4 mt-4">
              <RoleBadge role={selectedUser.role} size="md" />
              <ArrowRight class="w-5 h-5 text-gray-400" />
              <RoleBadge role={confirmAction.newRole} size="md" />
            </div>
          {/if}
        </div>
        <div class="flex justify-center space-x-4 px-4 py-3">
          <button
            type="button"
            class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onclick={cancelAction}
          >
            <X class="w-4 h-4 inline mr-1" />
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            onclick={executeAction}
          >
            <CheckCircle class="w-4 h-4 inline mr-1" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Annotation Modal -->
{#if showAnnotationModal && selectedUser}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" transition:fade>
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <FileText class="w-5 h-5 mr-2 text-blue-500" />
            User Annotation
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            onclick={closeAnnotationModal}
            disabled={isLoading}
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Add notes or comments about {selectedUser.name}
        </p>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <div class="space-y-4">
          <!-- User Info -->
          <div class="flex items-center justify-between space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              {#if selectedUser.image}
                <img class="h-10 w-10 rounded-full" src={selectedUser.image} alt="{selectedUser.name}" />
              {:else}
                <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <Users class="h-5 w-5 text-gray-600" />
                </div>
              {/if}
              <div>
                <div class="text-sm font-medium text-gray-900">{selectedUser.name}</div>
                <div class="text-xs text-gray-500">{selectedUser.email}</div>
              </div>
            </div>
            <div class="ml-auto">
              <RoleBadge role={selectedUser.role} size="sm" />
            </div>
          </div>

          <!-- Annotation Input -->
          <div>
            <label for="annotation-input" class="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes
            </label>
            <textarea
              id="annotation-input"
              bind:value={annotationText}
              placeholder="Enter notes, comments, or important information about this user..."
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              These notes are only visible to administrators.
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            onclick={cancelAnnotationModal}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            onclick={saveAnnotation}
            disabled={isLoading}
          >
            {#if isLoading}
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Updating...
            {:else}
              <CheckCircle class="w-4 h-4 mr-2" />
              {annotationText.trim() ? 'Update Annotation' : 'Clear Annotation'}
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
