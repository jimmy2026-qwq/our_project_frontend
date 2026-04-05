import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RequireAuth } from '@/components/shared/auth/RequireAuth';
import { RequireRegisteredUser } from '@/components/shared/auth/RequireRegisteredUser';
import { BlueprintHomePage } from '@/pages/BlueprintHomePage';
import { LoginPage } from '@/pages/LoginPage';
import { MemberHubPage } from '@/pages/MemberHubPage';
import { PublicClubDetailPage } from '@/pages/PublicClubDetailPage';
import { PublicHallHomePage } from '@/pages/PublicHallHomePage';
import { PublicTournamentDetailPage } from '@/pages/PublicTournamentDetailPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { TournamentOpsPage } from '@/pages/TournamentOpsPage';

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
                index: true,
                element: <BlueprintHomePage />,
              },
              {
                path: 'member-hub',
                element: <MemberHubPage />,
              },
              {
                path: 'tournament-ops',
                element: <TournamentOpsPage />,
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
