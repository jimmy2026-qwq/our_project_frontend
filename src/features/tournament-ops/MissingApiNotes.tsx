import { WorkbenchBacklogPanel } from '@/components/shared/domain';

export function MissingApiNotes() {
  return (
    <WorkbenchBacklogPanel
      className="tournament-ops__note text-[color:var(--muted-strong)]"
      title="权限可见性说明"
      description="前端目前基于较粗粒度的角色判断权限。后续如果有操作员权限快照接口，这里的功能可见性还能进一步细化。"
      items={[
        {
          id: 'permissions',
          title: 'GET /operators/:id/permissions',
          detail: '如果后端提供专门的权限快照，前端就能更准确地隐藏或展示赛事工具。',
        },
      ]}
    />
  );
}
