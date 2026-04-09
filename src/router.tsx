import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RequireAuth } from '@/components/shared/auth/RequireAuth';
import { RequireRegisteredUser } from '@/components/shared/auth/RequireRegisteredUser';
import { BlueprintHomePage } from '@/pages/BlueprintHomePage';
import { LoginPage } from '@/pages/LoginPage';
import { PublicClubDetailPage } from '@/pages/PublicClubDetailPage';
import { PublicHallHomePage } from '@/pages/PublicHallHomePage';
import { PublicTournamentDetailPage } from '@/pages/PublicTournamentDetailPage';
import { PlayerDashboardPage } from '@/pages/PlayerDashboardPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { TableMatchPage } from '@/pages/TableMatchPage';
import { TablePaifuPage } from '@/pages/TablePaifuPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
                element: <PublicHallHomePage />,
              },
              {
                path: 'tournaments/:tournamentId',
                element: <PublicTournamentDetailPage />,
              },
              {
                path: 'clubs/:clubId',
                element: <PublicClubDetailPage />,
              },
            ],
          },
          {
            element: <RequireRegisteredUser />,
            children: [
              {
                path: 'blueprint',
                element: <BlueprintHomePage />,
              },
              {
                path: 'me',
                element: <PlayerDashboardPage />,
              },
              {
                path: 'tables/:tableId',
                element: <TableMatchPage />,
              },
              {
                path: 'tables/:tableId/paifu',
                element: <TablePaifuPage />,
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
