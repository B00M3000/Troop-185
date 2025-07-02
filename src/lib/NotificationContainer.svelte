<script lang="ts">
  import { notifications } from '@/lib/stores/notifications';
  import NotificationItem from '@/lib/NotificationItem.svelte';
  import { untrack } from 'svelte';

  let notificationList = $state([]);

  // Subscribe to notifications store using $effect
  $effect(() => {
    const unsubscribe = notifications.subscribe(value => {
      untrack(() => {
        notificationList = value;
      });
    });

    return () => unsubscribe();
  });

  const handleClose = (id: string) => {
    notifications.remove(id);
  };
</script>

<!-- Notification Container -->
<div class="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
  {#each notificationList as notification (notification.id)}
    <NotificationItem
      id={notification.id}
      type={notification.type}
      message={notification.message}
      timeout={notification.timeout}
      onClose={handleClose}
    />
  {/each}
</div>
