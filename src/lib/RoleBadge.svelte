<script lang="ts">
  import { Shield, Users, UserCheck, UserX } from 'lucide-svelte';

  interface Props {
    role: "UNASSIGNED" | "SCOUT" | "ADULT" | "ADMIN";
    size?: 'sm' | 'md' | 'lg';
  }

  let { role, size = 'md' }: Props = $props();

  // Role configuration
  const roleConfig = {
    'ADMIN': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Shield,
      label: 'Admin'
    },
    'ADULT': {
      color: 'bg-blue-100 text-blue-800',
      icon: UserCheck,
      label: 'Adult'
    },
    'SCOUT': {
      color: 'bg-green-100 text-green-800',
      icon: Users,
      label: 'Scout'
    },
    'UNASSIGNED': {
      color: 'bg-gray-100 text-gray-800',
      icon: UserX,
      label: 'Unassigned'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  let config = $derived(roleConfig[role]);
  let IconComponent = $derived(config.icon);
</script>

<span class="inline-flex items-center rounded-full font-medium {config.color} {sizeClasses[size]}">
  <IconComponent class="{iconSizes[size]} mr-1" />
  {config.label}
</span>
