import { Button, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubApplicationView } from '@/pages/objects/ClubApplicationViews';

const heroActionClassName =
  'min-h-[42px] min-w-[132px] px-4 text-center text-[0.9rem] leading-5';

export function ClubHeroActions({
  isClubMember,
  canApply,
  currentApplicationStatus,
  onApply,
}: {
  isClubMember: boolean;
  canApply: boolean;
  currentApplicationStatus: ClubApplicationView['status'] | null;
  onApply: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 pr-16 sm:pr-20">
      {isClubMember ? (
        <StatusPill tone="success" className={heroActionClassName}>
          已是俱乐部成员
        </StatusPill>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Pending' ? (
        <Button
          className={cx(
            heroActionClassName,
            'border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.16)] text-[#ecc57a]',
          )}
          onClick={onApply}
        >
          申请处理中
        </Button>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Rejected' ? (
        <Button
          variant="danger"
          className={cx(
            heroActionClassName,
            'border-[rgba(255,123,123,0.34)] bg-[rgba(120,23,23,0.28)] text-[rgba(255,219,219,0.96)]',
          )}
          onClick={onApply}
        >
          申请被拒
        </Button>
      ) : null}
      {!isClubMember && canApply && !currentApplicationStatus ? (
        <Button
          variant="secondary"
          className={heroActionClassName}
          onClick={onApply}
        >
          申请加入
        </Button>
      ) : null}
    </div>
  );
}
