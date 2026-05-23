import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RequireAuth } from '@/app/guards/RequireAuth';
import { RequireRegisteredUser } from '@/app/guards/RequireRegisteredUser';

const demoRoutes = import.meta.env.DEV
  ? [
      {
        path: '/demo/tables/:tableId/paifu',
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
    lazy: async () => {
      const { LoginPage } = await import('@/pages/Auth/LoginPage');
      return { Component: LoginPage };
    },
  },
  {
    path: '/register',
    lazy: async () => {
      const { RegisterPage } = await import('@/pages/Auth/RegisterPage');
      return { Component: RegisterPage };
    },
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <Navigate replace to="/public" />,
          },
          {
            path: 'public',
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
                lazy: async () => {
                  const { PublicClubDetailPage } = await import('@/pages/PublicClubDetailPage');
                  return { Component: PublicClubDetailPage };
                },
              },
            ],
          },
          {
            element: <RequireRegisteredUser />,
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
