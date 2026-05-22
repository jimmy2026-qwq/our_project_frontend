import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { TournamentOpsWorkbench } from './components/TournamentOpsWorkbench';

export function TournamentOpsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const canManageActions =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

  if (
    !session?.user.roles.isSuperAdmin &&
    !session?.user.roles.isTournamentAdmin
  ) {
    return <Navigate replace to="/public" />;
  }

  return (
    <TournamentOpsWorkbench
      operatorId={operatorId}
      canManageActions={canManageActions}
      onNavigateToTable={(tableId) => navigate(`/tables/${tableId}`)}
      onNavigateToPaifu={(tableId) => navigate(`/tables/${tableId}/paifu`)}
    />
  );
}
