import { notifications } from '@/lib/stores/notifications';

export const notify = {
  success: (message: string, timeout?: number) => {
    return notifications.add({ type: 'success', message, timeout });
  },
  error: (message: string, timeout?: number) => {
    return notifications.add({ type: 'error', message, timeout });
  }
};

export { notifications };
