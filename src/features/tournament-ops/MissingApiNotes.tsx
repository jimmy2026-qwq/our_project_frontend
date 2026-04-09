import { WorkbenchBacklogPanel } from '@/components/shared/domain';

export function MissingApiNotes() {
  return (
    <WorkbenchBacklogPanel
      className="tournament-ops__note text-[color:var(--muted-strong)]"
      title="Permission Visibility"
      description="The frontend currently checks coarse auth roles. Tournament-scoped permission visibility can be tightened when an operator permission endpoint is available."
      items={[
        {
          id: 'permissions',
          title: 'GET /operators/:id/permissions',
          detail: 'A dedicated permission snapshot would let the frontend hide or reveal tournament tools more precisely.',
        },
      ]}
    />
  );
}
