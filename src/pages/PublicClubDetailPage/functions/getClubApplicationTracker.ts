import type { TrackedClubApplicationItem } from '../objects/ClubApplication.types';

const STORAGE_KEY = 'riichi-nexus.club-application-tracker';

export function isProvisionalClubApplicationId(id: string) {
  return id.startsWith('pending:');
}

export function createProvisionalClubApplicationId(
  clubId: string,
  playerId: string,
) {
  return `pending:${clubId}:${playerId}`;
}

function canUseStorage() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function readClubApplicationTracker(): TrackedClubApplicationItem[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return (JSON.parse(raw) as unknown[])
      .map(normalizeTrackedClubApplicationItem)
      .filter((item): item is TrackedClubApplicationItem => item !== null);
  } catch {
    return [];
  }
}

function normalizeTrackedClubApplicationItem(
  value: unknown,
): TrackedClubApplicationItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Partial<TrackedClubApplicationItem> & {
    operatorId?: string;
  };
  const playerId = item.playerId ?? item.operatorId;

  if (
    typeof item.id !== 'string' ||
    typeof item.clubId !== 'string' ||
    typeof item.clubName !== 'string' ||
    typeof playerId !== 'string' ||
    typeof item.applicantName !== 'string' ||
    typeof item.message !== 'string' ||
    typeof item.status !== 'string' ||
    typeof item.submittedAt !== 'string' ||
    typeof item.source !== 'string'
  ) {
    return null;
  }

  return {
    id: item.id,
    clubId: item.clubId,
    clubName: item.clubName,
    playerId,
    applicantName: item.applicantName,
    message: item.message,
    status: item.status,
    submittedAt: item.submittedAt,
    source: item.source,
  };
}

function writeClubApplicationTracker(items: TrackedClubApplicationItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertTrackedClubApplication(item: TrackedClubApplicationItem) {
  const items = readClubApplicationTracker();
  const incomingProvisional = isProvisionalClubApplicationId(item.id);
  const next = [
    item,
    ...items.filter((existing) => {
      if (existing.id === item.id) {
        return false;
      }

      const sameClubAndOperator =
        existing.clubId === item.clubId &&
        existing.playerId === item.playerId;

      if (!sameClubAndOperator) {
        return true;
      }

      const existingProvisional = isProvisionalClubApplicationId(existing.id);

      if (!incomingProvisional && existingProvisional) {
        return false;
      }

      if (incomingProvisional && !existingProvisional) {
        return true;
      }

      return true;
    }),
  ].slice(0, 20);
  writeClubApplicationTracker(next);
}

export function updateTrackedClubApplicationStatus(
  id: string,
  status: TrackedClubApplicationItem['status'],
) {
  const items = readClubApplicationTracker();
  const next = items.map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeClubApplicationTracker(next);
}

export function readTrackedClubApplication(id: string) {
  return readClubApplicationTracker().find((item) => item.id === id) ?? null;
}

export function readTrackedClubApplicationsByPlayer(playerId: string) {
  return readClubApplicationTracker().filter(
    (item) => item.playerId === playerId,
  );
}
