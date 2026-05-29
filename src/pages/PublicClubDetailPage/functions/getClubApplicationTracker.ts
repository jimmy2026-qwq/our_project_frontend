import type { TrackedClubApplicationItem } from '../objects/ClubApplication.types';

const STORAGE_KEY = 'riichi-nexus.club-application-tracker';

export function isProvisionalClubApplicationId(id: string) {
  return id.startsWith('pending:');
}

export function createProvisionalClubApplicationId(
  clubId: string,
  operatorId: string,
) {
  return `pending:${clubId}:${operatorId}`;
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
    return JSON.parse(raw) as TrackedClubApplicationItem[];
  } catch {
    return [];
  }
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
        existing.operatorId === item.operatorId;

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

export function readTrackedClubApplicationsByOperator(operatorId: string) {
  return readClubApplicationTracker().filter(
    (item) => item.operatorId === operatorId,
  );
}
