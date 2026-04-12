import { Tabs, TabsList, TabsTrigger } from '@/components/ui';

import type { PublicHallTabsProps } from './shared.types';

export const PublicHallTabs = ({ activeView, onSelectView }: PublicHallTabsProps) => {
  const tabs: Array<{ id: PublicHallTabsProps['activeView']; label: string; summary: string }> = [
    { id: 'schedules', label: 'Schedules', summary: 'Browse public tournament stages and timing.' },
    { id: 'clubs', label: 'Clubs', summary: 'Browse public club cards and open profiles.' },
    { id: 'leaderboard', label: 'Leaderboard', summary: 'Check ELO ranking and player status.' },
  ];

  return (
    <Tabs
      value={activeView}
      onValueChange={(value) => onSelectView(value as PublicHallTabsProps['activeView'])}
      className="portal-tabs-shell"
    >
      <TabsList className="portal-tabs grid gap-[14px] md:grid-cols-3" aria-label="Public hall navigation">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="portal-tab cursor-pointer">
            <strong>{tab.label}</strong>
            <span>{tab.summary}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
