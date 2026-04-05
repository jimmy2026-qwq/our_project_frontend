import { useReducer } from 'react';

import { MemberHubLoading, MemberHubPageSection } from '@/features/member-hub/components';
import { DEFAULT_MEMBER_HUB_DIRECTORY } from '@/features/member-hub/data';
import { useMemberHubActions, useMemberHubData, useMemberHubState } from '@/features/member-hub/hooks';

export function MemberHubPage() {
  const { state, setState, directory } = useMemberHubState();
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const { playerPayload, clubPayload, inboxPayload, isLoading } = useMemberHubData(directory, state, reloadKey);
  const actions = useMemberHubActions(directory ?? DEFAULT_MEMBER_HUB_DIRECTORY, state, setState, forceReload);

  if (!directory || isLoading || !playerPayload || !clubPayload || !inboxPayload) {
    return <MemberHubLoading />;
  }

  return (
    <MemberHubPageSection
      directory={directory}
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
