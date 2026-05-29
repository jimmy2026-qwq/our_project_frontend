import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import { getTournamentStatusLabel } from '../../../functions/formatClubDetail';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';
import { clubPanelClassNames } from '../styles';

export function ClubRecentTournamentsPanel({
  tournaments,
  canManageLineup,
  onAcceptInvitation,
  onDeclineInvitation,
  onOpenLineup,
}: {
  tournaments: ClubPublicProfile['activeTournaments'];
  canManageLineup: boolean;
  onAcceptInvitation: (
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) => void;
  onDeclineInvitation: (
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) => void;
  onOpenLineup: (
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) => void;
}) {
  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {tournaments.length > 0 ? (
          tournaments.map((item) => {
            const isInvited = item.participationStatus === 'Invited';
            const canRespondToInvitation = isInvited && item.canDecline;

            return (
              <article key={item.id} className={clubPanelClassNames.row}>
                <div className={clubPanelClassNames.rowMain}>
                  <strong>{item.name}</strong>
                  <span>
                    {item.source === 'invited' ? '受邀赛事' : '相关赛事'}
                  </span>
                  <span>
                    {item.status ? getTournamentStatusLabel(item.status) : '--'}
                  </span>
                </div>
                <div className={clubPanelClassNames.rowSide}>
                  <div className={clubPanelClassNames.actionRow}>
                    {canRespondToInvitation ? (
                      <>
                        <button
                          type="button"
                          className={cx(
                            clubPanelClassNames.action,
                            clubPanelClassNames.actionSecondary,
                          )}
                          onClick={() => onAcceptInvitation(item)}
                        >
                          通过邀请
                        </button>
                        <button
                          type="button"
                          className={cx(
                            clubPanelClassNames.action,
                            clubPanelClassNames.actionDanger,
                          )}
                          onClick={() => onDeclineInvitation(item)}
                        >
                          拒绝邀请
                        </button>
                      </>
                    ) : null}
                    {!isInvited && canManageLineup && item.canSubmitLineup ? (
                      <button
                        type="button"
                        className={cx(
                          clubPanelClassNames.action,
                          clubPanelClassNames.actionSecondary,
                        )}
                        onClick={() => onOpenLineup(item)}
                      >
                        邀请成员参赛
                      </button>
                    ) : null}
                    <Link
                      className={clubPanelClassNames.action}
                      to={`/public/tournaments/${item.id}`}
                      reloadDocument
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState asListItem={false}>
            当前还没有可展示的相关赛事。
          </EmptyState>
        )}
      </div>
    </section>
  );
}
