import { toast } from 'sonner';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export function useOnlineStatus() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success('You are back online!');
    };

    const handleOffline = () => {
      toast.error('You are offline. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
}
