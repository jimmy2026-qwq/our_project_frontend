import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell } from '@/components/shared/data-display';

export function MemberHubPage() {
  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
          返回公共大厅
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="成员工作台"
          title="成员工作台已精简"
          summary="俱乐部加入申请的审批能力已经迁移到俱乐部详情页。其余看板和工作台功能暂不开放。"
        />
      }
    />
  );
}
