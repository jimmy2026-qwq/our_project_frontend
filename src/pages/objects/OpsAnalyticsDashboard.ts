export interface DashboardSummary {
  ownerId: string;
  ownerType: 'player' | 'club';
  headline: string;
  metrics: Array<{
    label: string;
    value: string;
    accent?: 'gold' | 'teal' | 'red';
  }>;
}
