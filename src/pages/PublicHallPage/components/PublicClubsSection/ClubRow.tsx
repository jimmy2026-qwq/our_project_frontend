import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
} from '@/components/ui';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

import {
  formatNumber,
  getRelationLabel,
} from '../../functions/getPublicHallLabels';
import { hallSectionClassNames } from '../PublicHallSection.styles';

export function ClubRow({
  club,
  clubNamesById,
}: {
  club: ClubSummary;
  clubNamesById: Record<string, string>;
}) {
  const [isRelationDialogOpen, setIsRelationDialogOpen] = useState(false);
  const detailedRelations = club.relations.filter(
    (relation) => typeof relation !== 'string',
  );
  const hasRelations = detailedRelations.length > 0;

  return (
    <>
      <article key={club.id} className={hallSectionClassNames.row}>
        <div className={hallSectionClassNames.rowMain}>
          <strong>{club.name}</strong>
          <span>{`战力值：${club.powerRating}`}</span>
          <span>{`金库：${formatNumber(club.treasury)}`}</span>
        </div>
        <div className={hallSectionClassNames.rowSide}>
          <span>{`成员数：${club.memberCount}`}</span>
          <div className={hallSectionClassNames.actionRow}>
            {hasRelations ? (
              <button
                type="button"
                className={hallSectionClassNames.action}
                onClick={() => setIsRelationDialogOpen(true)}
              >
                查看关系
              </button>
            ) : null}
            <Link
              className={hallSectionClassNames.action}
              to={`/public/clubs/${club.id}`}
            >
              查看详情
            </Link>
          </div>
        </div>
      </article>

      {hasRelations ? (
        <Dialog
          open={isRelationDialogOpen}
          onOpenChange={setIsRelationDialogOpen}
        >
          <DialogPortal>
            <DialogOverlay />
            <DialogSurface>
              <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
                <DialogTitle>{club.name} 的俱乐部关系</DialogTitle>
              </DialogHeader>
              <DialogBody className="px-6 py-5">
                <dl className="m-0 grid gap-3">
                  {detailedRelations.map((relation) => (
                    <div
                      key={`${relation.targetClubId}-${relation.relation}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.035)] px-4 py-3"
                    >
                      <dt className="min-w-0 truncate text-[#f2f7fb]">
                        {clubNamesById[relation.targetClubId] ??
                          relation.targetClubId}
                      </dt>
                      <dd className="m-0 text-[#f5c98e]">
                        {getRelationLabel(relation)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </DialogBody>
            </DialogSurface>
          </DialogPortal>
        </Dialog>
      ) : null}
    </>
  );
}
