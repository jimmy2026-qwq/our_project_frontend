import { Link } from 'react-router-dom';

import {
  Button,
  DetailCard,
  DetailRow,
  DetailRows,
  EmptyState,
  SelectField,
  StatusPill,
} from '@/components/ui';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

const tournamentPanelClassNames = {
  link: 'inline-flex font-semibold text-[#8fe8e1] no-underline hover:text-[#b2f4ef]',
};

export function TournamentInvitedClubsPanel({
  invitedClubs,
  lineupSubmissionCounts,
  selectableClubs,
  selectedClubId,
  canManageTournament,
  isSubmittingTournamentAction,
  onSelectedClubIdChange,
  onInviteClub,
}: {
  invitedClubs: ClubSummary[];
  lineupSubmissionCounts: Record<string, number>;
  selectableClubs: ClubSummary[];
  selectedClubId: string;
  canManageTournament: boolean;
  isSubmittingTournamentAction: boolean;
  onSelectedClubIdChange: (value: string) => void;
  onInviteClub: () => void;
}) {
  return (
    <DetailCard
      title={
        <span className="text-[1.25rem] font-semibold">
          {invitedClubs.length > 0 ? '参赛俱乐部名单' : '邀请俱乐部'}
        </span>
      }
    >
      <div className="grid gap-4">
        {canManageTournament ? (
          <>
            <p className="m-0 text-[#9ab0c1]">
              将俱乐部加入本赛事参赛名单。新邀请的俱乐部会立即出现在下方列表中。
            </p>
            <SelectField
              label="俱乐部"
              value={selectedClubId}
              onChange={(event) =>
                onSelectedClubIdChange(event.currentTarget.value)
              }
              disabled={
                isSubmittingTournamentAction || selectableClubs.length === 0
              }
            >
              {selectableClubs.length > 0 ? (
                selectableClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))
              ) : (
                <option value="">没有可邀请的俱乐部</option>
              )}
            </SelectField>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onInviteClub}
                disabled={
                  !selectedClubId ||
                  isSubmittingTournamentAction ||
                  selectableClubs.length === 0
                }
              >
                邀请俱乐部
              </Button>
            </div>
          </>
        ) : null}
        {invitedClubs.length > 0 ? (
          <DetailRows>
            {invitedClubs.map((club) => (
              <DetailRow
                key={club.id}
                title={
                  <span className="flex flex-wrap items-center gap-3">
                    <Link
                      className={tournamentPanelClassNames.link}
                      to={`/public/clubs/${club.id}`}
                    >
                      {club.name}
                    </Link>
                    {canManageTournament ? (
                      <StatusPill
                        tone={
                          (lineupSubmissionCounts[club.id] ?? 0) > 0
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {(lineupSubmissionCounts[club.id] ?? 0) > 0
                          ? `已确定 ${lineupSubmissionCounts[club.id] ?? 0} 人`
                          : '待确定'}
                      </StatusPill>
                    ) : null}
                  </span>
                }
                detail={`${club.memberCount} 名成员 / 战力 ${club.powerRating}`}
              />
            ))}
          </DetailRows>
        ) : (
          <EmptyState asListItem={false}>
            {canManageTournament
              ? '当前还没有俱乐部加入这场比赛。'
              : '当前还没有公布参赛俱乐部名单。'}
          </EmptyState>
        )}
      </div>
    </DetailCard>
  );
}
