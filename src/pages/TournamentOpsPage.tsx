import { Navigate } from 'react-router-dom';

import { TournamentOpsWorkbench } from '@/features/tournament-ops';
import { useAuth } from '@/hooks';

export function TournamentOpsPage() {
  const { session } = useAuth();

  if (
    !session?.user.roles.isSuperAdmin &&
    !session?.user.roles.isTournamentAdmin
  ) {
    return <Navigate replace to="/public" />;
  }

  return <TournamentOpsWorkbench />;
}
