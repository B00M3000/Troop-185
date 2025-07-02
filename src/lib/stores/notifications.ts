import { writable } from 'svelte/store';

export interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
  timeout?: number;
}

function createNotificationStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,
    add: (notification: Omit<Notification, 'id'>) => {
      const id = crypto.randomUUID();
      const newNotification: Notification = {
        ...notification,
        id,
        timeout: notification.timeout || 10000 // 10 seconds default
      };

      update(notifications => [...notifications, newNotification]);

      // Auto-remove after timeout
      if (newNotification.timeout && newNotification.timeout > 0) {
        setTimeout(() => {
          update(notifications => notifications.filter(n => n.id !== id));
        }, newNotification.timeout);
      }

      return id;
    },
    remove: (id: string) => {
      update(notifications => notifications.filter(n => n.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const notifications = createNotificationStore();
