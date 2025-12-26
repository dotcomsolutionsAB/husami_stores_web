import 'src/global.css';

import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useOnlineStatus } from 'src/hooks/use-online-status';

import { setErrorHandlerDispatch, setErrorHandlerNavigate } from 'src/utils/error-handler';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ConfirmDialogProvider } from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  useScrollToTop();
  useOnlineStatus();

  // Set dispatch and router for error handler
  useEffect(() => {
    setErrorHandlerDispatch(dispatch);
    setErrorHandlerNavigate(router.push);
  }, [dispatch, router]);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ConfirmDialogProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ConfirmDialogProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
