import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { BlueprintHomePage } from '@/pages/BlueprintHomePage';
import { MemberHubPage } from '@/pages/MemberHubPage';
import { PublicClubDetailPage } from '@/pages/PublicClubDetailPage';
import { PublicHallHomePage } from '@/pages/PublicHallHomePage';
import { PublicTournamentDetailPage } from '@/pages/PublicTournamentDetailPage';
import { TournamentOpsPage } from '@/pages/TournamentOpsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <BlueprintHomePage />,
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
        path: 'member-hub',
        element: <MemberHubPage />,
      },
      {
        path: 'tournament-ops',
        element: <TournamentOpsPage />,
      },
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
]);
