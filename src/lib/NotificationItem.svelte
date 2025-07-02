<script lang="ts">
  import { CheckCircle, AlertTriangle, X } from 'lucide-svelte';
  import { slide, fade } from 'svelte/transition';
  
  interface Props {
    id: string;
    type: 'success' | 'error';
    message: string;
    timeout?: number;
    onClose?: (id: string) => void;
  }

  let { id, type, message, timeout = 10000, onClose }: Props = $props();

  let timeRemaining = $state(timeout / 1000); // Convert to seconds
  let intervalId: number | null = null;

  // Start countdown
  $effect(() => {
    if (timeout > 0) {
      intervalId = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
          if (intervalId) clearInterval(intervalId);
          if (onClose) onClose(id);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  const handleClose = () => {
    if (intervalId) clearInterval(intervalId);
    if (onClose) {
      onClose(id);
    }
  };

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-400',
      textColor: 'text-green-800',
      buttonColor: 'text-green-500 hover:text-green-600'
    },
    error: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
      textColor: 'text-red-800',
      buttonColor: 'text-red-500 hover:text-red-600'
    }
  };

  let notificationConfig = $derived(config[type]);
  let IconComponent = $derived(notificationConfig.icon);
</script>

<div 
  class="flex items-start p-4 mb-3 {notificationConfig.bgColor} border {notificationConfig.borderColor} rounded-lg shadow-sm relative overflow-hidden"
  transition:slide={{ duration: 300 }}
  role="alert"
>
  <!-- Progress bar for countdown -->
  {#if timeout > 0}
    <div 
      class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-1000 ease-linear"
      style="width: {(timeRemaining / (timeout / 1000)) * 100}%"
    ></div>
  {/if}
  
  <IconComponent class="h-5 w-5 {notificationConfig.iconColor} mt-0.5 flex-shrink-0" />
  <div class="ml-3 flex-1">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium {notificationConfig.textColor}">
        {message}
      </p>
      {#if timeout > 0}
        <span class="text-xs {notificationConfig.textColor} opacity-60 ml-2">
          {timeRemaining}s
        </span>
      {/if}
    </div>
  </div>
  <button
    type="button"
    class="ml-3 inline-flex {notificationConfig.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600 transition-colors"
    onclick={handleClose}
    aria-label="Close notification"
  >
    <X class="h-5 w-5" />
  </button>
</div>
