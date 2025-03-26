interface NotifyOptions {
  description: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useNotify = () => {
  return (options: NotifyOptions) => {
    // You can replace this with your preferred notification system
    // For now, using console.log as a fallback
    console.log(`[${options.status.toUpperCase()}] ${options.description}`);
  };
}; 