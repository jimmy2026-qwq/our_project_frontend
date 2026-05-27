import { Button, StatusPill } from '@/components/ui';
import type { ClubApplicationView } from '@/pages/objects/club';

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
    <div className="flex flex-wrap items-center gap-3">
      {isClubMember ? (
        <StatusPill tone="success">你已经是俱乐部成员</StatusPill>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Pending' ? (
        <Button
          className="border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.16)] text-[#ecc57a]"
          onClick={onApply}
        >
          申请等待处理中
        </Button>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Rejected' ? (
        <Button
          variant="danger"
          className="border-[rgba(255,123,123,0.34)] bg-[rgba(120,23,23,0.28)] text-[rgba(255,219,219,0.96)]"
          onClick={onApply}
        >
          申请被拒绝
        </Button>
      ) : null}
      {!isClubMember && canApply && !currentApplicationStatus ? (
        <Button variant="secondary" onClick={onApply}>
          申请加入俱乐部
        </Button>
      ) : null}
    </div>
  );
}
