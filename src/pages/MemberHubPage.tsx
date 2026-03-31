import { useReducer } from 'react';

import { MemberHubLoading, MemberHubPageSection } from '@/features/member-hub/components';
import { useMemberHubActions, useMemberHubData, useMemberHubState } from '@/features/member-hub/hooks';

export function MemberHubPage() {
  const { state, setState } = useMemberHubState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const { playerPayload, clubPayload, inboxPayload, isLoading } = useMemberHubData(state, reloadKey);
  const actions = useMemberHubActions(state, setState, forceReload);

  if (isLoading || !playerPayload || !clubPayload || !inboxPayload) {
    return <MemberHubLoading />;
  }

  return (
    <MemberHubPageSection
      state={state}
      playerPayload={playerPayload}
      clubPayload={clubPayload}
      inboxPayload={inboxPayload}
      onReload={forceReload}
      onChangeOperator={(operatorId) => void actions.changeOperator(operatorId)}
      onChangePlayer={actions.changePlayer}
      onChangeClub={actions.changeClub}
      onReview={(applicationId, decision) => void actions.handleReview(applicationId, decision)}
    />
  );
}
