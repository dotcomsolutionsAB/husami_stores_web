import { toast } from 'sonner';

import { clearAuth } from 'src/store/slices/authSlice';

// ----------------------------------------------------------------------

export interface ApiError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
    statusCode?: number;
  };
  error?: string;
}

// ----------------------------------------------------------------------

export function handleApiError(error: any): string {
  // Check if user is offline
  if (!navigator.onLine) {
    toast.error('You are offline. Please check your internet connection.');
    return 'You are offline. Please check your internet connection.';
  }

  // Network error (failed to fetch)
  if (error?.status === 'FETCH_ERROR' || error?.error?.includes('fetch')) {
    toast.error('Network error. Please check your connection and try again.');
    return 'Network error. Please check your connection and try again.';
  }

  // Timeout error
  if (error?.status === 'TIMEOUT_ERROR') {
    toast.error('Request timeout. Please try again.');
    return 'Request timeout. Please try again.';
  }

  // Parse error
  if (error?.status === 'PARSING_ERROR') {
    toast.error('Invalid response from server. Please try again.');
    return 'Invalid response from server. Please try again.';
  }

  // HTTP status errors
  const status = error?.status || error?.data?.statusCode;
  const message =
    error?.data?.message || error?.data?.error || error?.message || 'An error occurred';

  switch (status) {
    case 400:
      toast.error(message || 'Bad request. Please check your input.');
      return message || 'Bad request. Please check your input.';

    case 401:
      toast.error('Your session has expired. Please login again.');
      // Call logout function
      handleLogout();
      return 'Your session has expired. Please login again.';

    case 403:
      toast.error('You do not have permission to perform this action.');
      return 'You do not have permission to perform this action.';

    case 404:
      toast.error(message || 'Resource not found.');
      return message || 'Resource not found.';

    case 409:
      toast.error(message || 'Conflict. This resource already exists.');
      return message || 'Conflict. This resource already exists.';

    case 422:
      toast.error(message || 'Validation error. Please check your input.');
      return message || 'Validation error. Please check your input.';

    case 429:
      toast.error('Too many requests. Please slow down and try again later.');
      return 'Too many requests. Please slow down and try again later.';

    case 500:
      toast.error('Server error. Please try again later.');
      return 'Server error. Please try again later.';

    case 502:
    case 503:
      toast.error('Service temporarily unavailable. Please try again later.');
      return 'Service temporarily unavailable. Please try again later.';

    case 504:
      toast.error('Gateway timeout. Please try again.');
      return 'Gateway timeout. Please try again.';

    default:
      // Generic error
      toast.error(message);
      return message;
  }
}

// ----------------------------------------------------------------------

export function isNetworkError(error: any): boolean {
  return (
    !navigator.onLine ||
    error?.status === 'FETCH_ERROR' ||
    error?.error?.includes('fetch') ||
    error?.status === 'TIMEOUT_ERROR'
  );
}

// ----------------------------------------------------------------------

export function getErrorMessage(error: any): string {
  if (!navigator.onLine) {
    return 'You are offline. Please check your internet connection.';
  }

  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.message ||
    error?.error ||
    'An error occurred'
  );
}

// ----------------------------------------------------------------------

let storeDispatch: any = null;
let routerNavigate: any = null;

export function setErrorHandlerDispatch(dispatch: any) {
  storeDispatch = dispatch;
}

export function setErrorHandlerNavigate(navigate: any) {
  routerNavigate = navigate;
}

export async function handleLogout() {
  try {
    // Clear Redux state and localStorage
    if (storeDispatch) {
      storeDispatch(clearAuth());
    } else {
      // Fallback if dispatch not available
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.removeItem('user');
  } finally {
    // Use React Router navigation if available, otherwise fallback to window.location
    setTimeout(() => {
      if (routerNavigate) {
        routerNavigate('/sign-in');
      } else {
        window.location.href = '/sign-in';
      }
    }, 1000);
  }
}
