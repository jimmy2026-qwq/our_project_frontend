import { DetailCard, MetricCard, MetricGrid } from '@/components/ui';

import {
  formatNumber,
  getRelationLabel,
} from '../../../functions/formatClubDetail';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

export function ClubPublicInfoPanel({
  profile,
  featuredPlayerNames,
}: {
  profile: ClubPublicProfile;
  featuredPlayerNames: string[];
}) {
  return (
    <DetailCard title="俱乐部概览">
      <div className="grid gap-5">
        <MetricGrid>
          <MetricCard
            label="成员数"
            value={
              <span className="text-[#ecc57a]">{profile.memberCount}</span>
            }
          />
          <MetricCard
            label="战力评分"
            value={
              <span className="text-[#ecc57a]">{profile.powerRating}</span>
            }
            accent="warning"
          />
          <MetricCard
            label="俱乐部资金"
            value={
              <span className="text-[#ecc57a]">
                {formatNumber(profile.treasury)}
              </span>
            }
          />
          <MetricCard
            label="关系"
            value={
              <span className="text-[#ecc57a]">
                {profile.relations.map(getRelationLabel).join(' / ') || '--'}
              </span>
            }
          />
        </MetricGrid>
        <div className="rounded-[22px] border border-[color:rgba(134,151,176,0.28)] bg-[rgba(255,255,255,0.03)] px-6 py-5">
          <p className="m-0 text-[0.95rem] text-[#c7d6e2]">核心成员</p>
          <strong className="mt-3 block text-[1.02rem] leading-8 text-[#f2f7fb]">
            {featuredPlayerNames.join(' / ') || '--'}
          </strong>
        </div>
      </div>
    </DetailCard>
  );
}
