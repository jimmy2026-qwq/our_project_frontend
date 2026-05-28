import { SelectField, WorkbenchContextPanel } from '@/components/ui';

import type {
  MemberHubOperator,
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/MemberHub.types';

export function MemberHubContextPanel({
  directory,
  state,
  activeOperator,
  onReload,
  onChangeOperator,
  onChangePlayer,
  onChangeClub,
}: {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  activeOperator: MemberHubOperator;
  onReload: () => void;
  onChangeOperator: (operatorId: string) => void;
  onChangePlayer: (playerId: string) => void;
  onChangeClub: (clubId: string) => void;
}) {
  const clubOptions = Object.values(directory.clubsById);
  const playerOptions = directory.items.map((operator) => ({
    value: operator.playerId,
    label: operator.label.split(' / ')[0] || operator.playerId,
  }));

  return (
    <WorkbenchContextPanel
      className="text-[#c7d6e2]"
      title="Workspace Context"
      description="Switch operator scope and dashboard targets without pushing that state back into the page shell."
      onReload={onReload}
    >
      <SelectField
        label="Operator"
        value={state.operatorId}
        onChange={(event) => onChangeOperator(event.currentTarget.value)}
      >
        {directory.items.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.label}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="Player dashboard"
        value={state.playerId}
        onChange={(event) => onChangePlayer(event.currentTarget.value)}
      >
        {playerOptions.map((player) => (
          <option key={player.value} value={player.value}>
            {player.label}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="Managed club"
        value={state.clubId}
        onChange={(event) => onChangeClub(event.currentTarget.value)}
      >
        {clubOptions.map((club) => {
          const disabled =
            activeOperator.role !== 'ClubAdmin' ||
            !activeOperator.managedClubIds.includes(club.id);

          return (
            <option key={club.id} value={club.id} disabled={disabled}>
              {club.name}
            </option>
          );
        })}
      </SelectField>
    </WorkbenchContextPanel>
  );
}
