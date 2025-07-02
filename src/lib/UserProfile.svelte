<script lang="ts">
  import { User } from 'lucide-svelte'
  
  interface Props {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "UNASSIGNED" | "SCOUT" | "ADULT" | "ADMIN"
    }
    size?: 'sm' | 'md' | 'lg'
    showRole?: boolean
    showEmail?: boolean
  }

  let { user, size = 'md', showRole = true, showEmail = false }: Props = $props()

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const roleColorClasses = {
    SCOUT: 'bg-green-100 text-green-800',
    ADMIN: 'bg-yellow-100 text-yellow-800',
    UNASSIGNED: 'bg-gray-100 text-gray-600',
    ADULT: 'bg-blue-100 text-blue-800'
  }
</script>

<div class="flex items-center gap-3">
  {#if user.image}
    <img 
      src={user.image} 
      alt={user.name || 'User'}
      class="{sizeClasses[size]} rounded-full border-2 border-gray-300 object-cover"
    />
  {:else}
    <div class="{sizeClasses[size]} rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
      <User class="w-4 h-4 text-gray-500" />
    </div>
  {/if}
  
  <div class="flex flex-col">
    {#if user.name}
      <span class="font-medium {textSizeClasses[size]} text-gray-900">{user.name}</span>
    {/if}
    
    {#if showEmail && user.email}
      <span class="text-xs text-gray-500">{user.email}</span>
    {/if}
    
    {#if showRole && user.role}
      <span class="text-xs px-2 py-1 {roleColorClasses[user.role] || 'bg-red-100 text-red-800'} rounded-full inline-block w-fit">
        {roleColorClasses[user.role] ? user.role : 'ROLE ERROR'}
      </span>
    {:else if showRole}
      <span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full inline-block w-fit">
        ROLE ERROR
      </span>
    {/if}
  </div>
</div>
