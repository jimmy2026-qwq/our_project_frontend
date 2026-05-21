import { Navigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { TournamentOpsWorkbench } from './components/TournamentOpsWorkbench';

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
