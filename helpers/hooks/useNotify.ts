import { ref } from 'vue';

interface NotifyOptions {
  description: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Create a global notification instance
const notificationComponent = ref<any>(null);

export const useNotify = () => {
  return (options: NotifyOptions) => {
    if (notificationComponent.value) {
      notificationComponent.value.addNotification(options.description, options.status);
    }
  };
};

// Function to set the notification component instance
export const setNotificationComponent = (component: any) => {
  notificationComponent.value = component;
}; 