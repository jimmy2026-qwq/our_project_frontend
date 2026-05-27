import { useReducer } from 'react';

import {
  MemberHubLoading,
  MemberHubSection,
} from './components';
import {
  useMemberHubActions,
  useMemberHubData,
  useMemberHubState,
} from './hooks';

export function MemberHubPage() {
  const { state, setState, directory } = useMemberHubState();
  const [reloadKey, forceReload] = useReducer((value: number) => value + 1, 0);
  const { playerDashboardState, clubDashboardState, applicationInboxState, isLoading } =
    useMemberHubData(directory, state, reloadKey);

  const actions = useMemberHubActions(
    directory ?? { items: [], clubsById: {}, source: 'api' },
    state,
    setState,
    forceReload,
  );

  if (
    !directory ||
    isLoading ||
    !playerDashboardState ||
    !clubDashboardState ||
    !applicationInboxState
  ) {
    return <MemberHubLoading />;
  }

  return (
    <MemberHubSection
      directory={directory}
      state={state}
      playerDashboardState={playerDashboardState}
      clubDashboardState={clubDashboardState}
      applicationInboxState={applicationInboxState}
      onReload={forceReload}
      onChangeOperator={actions.changeOperator}
      onChangePlayer={actions.changePlayer}
      onChangeClub={actions.changeClub}
      onReview={actions.handleReview}
    />
  );
}
