import type { RootState } from 'src/store';
import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const UserPage = lazy(() => import('src/pages/users'));
const PickupCartPage = lazy(() => import('src/pages/pickup-cart'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Wrapper components to check auth state
function DashboardGuard() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user?.token) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <MainLayout>
      <Suspense fallback={renderFallback()}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}

function SignInGuard() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user?.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <Suspense fallback={renderFallback()}>
        <SignInPage />
      </Suspense>
    </AuthLayout>
  );
}

export const routesSection: RouteObject[] = [
  {
    element: <DashboardGuard />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UserPage />,
      },
      {
        path: 'pickup-cart',
        element: <PickupCartPage />,
      },
    ],
  },
  {
    path: 'sign-in',
    element: <SignInGuard />,
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
