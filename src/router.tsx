import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RouteErrorFallback } from '@/app/RouteErrorFallback';
import { RequireAuth } from '@/pages/Auth/RequireAuth';
import { RequireRegisteredUser } from '@/pages/Auth/RequireRegisteredUser';
import { PublicClubDetailPage } from '@/pages/PublicClubDetailPage';

const routeErrorElement = <RouteErrorFallback />;

const demoRoutes = import.meta.env.DEV
  ? [
      {
        path: '/demo/tables/:tableId/paifu',
        errorElement: routeErrorElement,
        lazy: async () => {
          const { TablePaifuPage } = await import('@/pages/TablePaifuPage');
          return { Component: TablePaifuPage };
        },
      },
    ]
  : [];

export const router = createBrowserRouter([
  ...demoRoutes,
  {
    path: '/login',
    errorElement: routeErrorElement,
    lazy: async () => {
      const { LoginPage } = await import('@/pages/Auth/LoginPage');
      return { Component: LoginPage };
    },
  },
  {
    path: '/register',
    errorElement: routeErrorElement,
    lazy: async () => {
      const { RegisterPage } = await import('@/pages/Auth/RegisterPage');
      return { Component: RegisterPage };
    },
  },
  {
    path: '/setup-superadmin',
    errorElement: routeErrorElement,
    lazy: async () => {
      const { SuperAdminSetupPage } = await import('@/pages/Auth/SuperAdminSetupPage');
      return { Component: SuperAdminSetupPage };
    },
  },
  {
    element: <RequireAuth />,
    errorElement: routeErrorElement,
    children: [
      {
        path: '/',
        element: <AppShell />,
        errorElement: routeErrorElement,
        children: [
          {
            index: true,
            element: <Navigate replace to="/public" />,
          },
          {
            path: 'public',
            errorElement: routeErrorElement,
            children: [
              {
                index: true,
                lazy: async () => {
                  const { PublicHallHomePage } = await import('@/pages/PublicHallPage');
                  return { Component: PublicHallHomePage };
                },
              },
              {
                path: 'tournaments/:tournamentId',
                lazy: async () => {
                  const { PublicTournamentDetailPage } = await import('@/pages/PublicTournamentDetailPage');
                  return { Component: PublicTournamentDetailPage };
                },
              },
              {
                path: 'clubs/:clubId',
                element: <PublicClubDetailPage />,
              },
            ],
          },
          {
            element: <RequireRegisteredUser />,
            errorElement: routeErrorElement,
            children: [
              {
                path: 'member-hub',
                lazy: async () => {
                  const { MemberHubPage } = await import('@/pages/MemberHubPage');
                  return { Component: MemberHubPage };
                },
              },
              {
                path: 'me',
                lazy: async () => {
                  const { PlayerDashboardPage } = await import('@/pages/PlayerDashboardPage');
                  return { Component: PlayerDashboardPage };
                },
              },
              {
                path: 'tournament-ops',
                lazy: async () => {
                  const { TournamentOpsPage } = await import('@/pages/TournamentOpsPage');
                  return { Component: TournamentOpsPage };
                },
              },
              {
                path: 'tables/:tableId',
                lazy: async () => {
                  const { TableMatchPage } = await import('@/pages/TableMatchPage');
                  return { Component: TableMatchPage };
                },
              },
              {
                path: 'tables/:tableId/paifu',
                lazy: async () => {
                  const { TablePaifuPage } = await import('@/pages/TablePaifuPage');
                  return { Component: TablePaifuPage };
                },
              },
            ],
          },
          {
            path: '*',
            element: <Navigate replace to="/public" />,
          },
        ],
      },
    ],
  },
]);
