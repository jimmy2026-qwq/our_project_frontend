import { apiClient } from '@/api/client';
import type { ClubApplication, ClubSummary, PlayerProfile } from '@/domain/models';
import {
  readClubApplicationsByOperator,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
} from '@/lib/club-applications';
import { mockClubs } from '@/mocks/overview';

export type DataSource = 'api' | 'mock';

export interface RegisteredPlayerOption {
  operatorId: string;
  nickname: string;
  note: string;
}

export interface ClubDirectoryState {
  items: ClubSummary[];
  source: DataSource;
  warning?: string;
}

export interface PlayerContextState {
  player: PlayerProfile | null;
  source?: DataSource;
  warning?: string;
}

export interface ApplicationState {
  application: ClubApplication | null;
  source?: DataSource;
  warning?: string;
}

export interface HomeClubApplicationState {
  operatorId: string;
  clubId: string;
  message: string;
  withdrawNote: string;
  clubs: ClubDirectoryState;
  playerContext: PlayerContextState;
  application: ApplicationState;
}

export const playerOptions: RegisteredPlayerOption[] = [
  {
    operatorId: 'player-registered-1',
    nickname: 'Aoi',
    note: '当前以注册玩家视角发起申请，适合验证首页申请流和 member hub 的状态联动。',
  },
  {
    operatorId: 'player-registered-2',
    nickname: 'Mika',
    note: '切换到第二位注册玩家后，可以验证不同操作人的申请隔离和 mock fallback 行为。',
  },
];

const mockApplications = new Map<string, ClubApplication>();

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function createMockClubApplication(
  clubId: string,
  operatorId: string,
  applicantName: string,
  message: string,
): ClubApplication {
  const application: ClubApplication = {
    id: `membership-${Date.now()}`,
    clubId,
    status: 'Pending',
    applicantName,
    message,
    createdAt: new Date().toISOString(),
  };
  mockApplications.set(`${clubId}:${operatorId}`, application);
  return application;
}

export function withdrawMockClubApplication(clubId: string, operatorId: string) {
  const key = `${clubId}:${operatorId}`;
  const existing = mockApplications.get(key);

  if (!existing) {
    throw new Error('Mock application not found.');
  }

  const updated: ClubApplication = {
    ...existing,
    status: 'Withdrawn',
  };
  mockApplications.set(key, updated);
  return updated;
}

export function getFallbackPlayer(operatorId: string) {
  return playerOptions.find((item) => item.operatorId === operatorId) ?? playerOptions[0];
}

export function getSelectedClubName(clubId: string, clubs: ClubSummary[]) {
  return clubs.find((club) => club.id === clubId)?.name ?? clubId;
}

export async function loadJoinableClubs(): Promise<ClubDirectoryState> {
  try {
    const envelope = await apiClient.getClubs({
      activeOnly: true,
      joinableOnly: true,
      limit: 20,
      offset: 0,
    });
    return {
      items: envelope.items,
      source: 'api',
    };
  } catch (error) {
    return {
      items: mockClubs,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

export async function loadPlayerContext(operatorId: string): Promise<PlayerContextState> {
  try {
    const player = await apiClient.getCurrentPlayer(operatorId);
    return {
      player,
      source: 'api',
    };
  } catch (error) {
    return {
      player: {
        playerId: operatorId,
        displayName: getFallbackPlayer(operatorId).nickname,
      },
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Current player fallback to mock.',
    };
  }
}

export function getOperatorApplications(operatorId: string) {
  return readClubApplicationsByOperator(operatorId).slice(0, 3);
}

export async function submitClubApplication(state: HomeClubApplicationState) {
  const selectedPlayerName =
    state.playerContext.player?.displayName ?? getFallbackPlayer(state.operatorId).nickname;
  const message = state.message.trim() || 'I would like to join next split.';

  try {
    const application = await apiClient.submitClubApplication(state.clubId, {
      operatorId: state.operatorId,
      message,
    });
    upsertClubApplicationInboxItem({
      id: application.id,
      clubId: state.clubId,
      clubName: getSelectedClubName(state.clubId, state.clubs.items),
      operatorId: state.operatorId,
      applicantName: selectedPlayerName,
      message: application.message,
      status: application.status,
      submittedAt: application.createdAt,
      source: 'api',
    });
    return { application, source: 'api' as const };
  } catch (error) {
    const application = createMockClubApplication(state.clubId, state.operatorId, selectedPlayerName, message);
    upsertClubApplicationInboxItem({
      id: application.id,
      clubId: state.clubId,
      clubName: getSelectedClubName(state.clubId, state.clubs.items),
      operatorId: state.operatorId,
      applicantName: selectedPlayerName,
      message: application.message,
      status: application.status,
      submittedAt: application.createdAt,
      source: 'mock',
    });
    return {
      application,
      source: 'mock' as const,
      warning: error instanceof Error ? error.message : 'Club application fallback to mock.',
    };
  }
}

export async function withdrawClubApplication(state: HomeClubApplicationState) {
  const applicationId = state.application.application?.id;

  if (!applicationId) {
    throw new Error('Application id is missing.');
  }

  try {
    const application = await apiClient.withdrawClubApplication(state.clubId, applicationId, {
      operatorId: state.operatorId,
      note: state.withdrawNote,
    });
    updateClubApplicationInboxStatus(application.id, application.status);
    return { application, source: 'api' as const };
  } catch (error) {
    const application = withdrawMockClubApplication(state.clubId, state.operatorId);
    updateClubApplicationInboxStatus(application.id, application.status);
    return {
      application,
      source: 'mock' as const,
      warning: error instanceof Error ? error.message : 'Withdraw request fallback to mock.',
    };
  }
}
