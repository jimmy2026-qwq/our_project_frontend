export interface ClubApplicationInboxItem {
  id: string;
  clubId: string;
  clubName: string;
  operatorId: string;
  applicantName: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  submittedAt: string;
  source: 'api' | 'mock';
}

const STORAGE_KEY = 'riichi-nexus.club-applications';

export function isProvisionalClubApplicationId(id: string) {
  return id.startsWith('pending:');
}

export function createProvisionalClubApplicationId(clubId: string, operatorId: string) {
  return `pending:${clubId}:${operatorId}`;
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readClubApplicationInbox(): ClubApplicationInboxItem[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ClubApplicationInboxItem[];
  } catch {
    return [];
  }
}

function writeClubApplicationInbox(items: ClubApplicationInboxItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertClubApplicationInboxItem(item: ClubApplicationInboxItem) {
  const items = readClubApplicationInbox();
  const incomingProvisional = isProvisionalClubApplicationId(item.id);
  const next = [
    item,
    ...items.filter((existing) => {
      if (existing.id === item.id) {
        return false;
      }

      const sameClubAndOperator =
        existing.clubId === item.clubId && existing.operatorId === item.operatorId;

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
  writeClubApplicationInbox(next);
}

export function updateClubApplicationInboxStatus(
  id: string,
  status: ClubApplicationInboxItem['status'],
) {
  const items = readClubApplicationInbox();
  const next = items.map((item) => (item.id === id ? { ...item, status } : item));
  writeClubApplicationInbox(next);
}

export function readClubApplicationInboxItem(id: string) {
  return readClubApplicationInbox().find((item) => item.id === id) ?? null;
}

export function readClubApplicationsByOperator(operatorId: string) {
  return readClubApplicationInbox().filter((item) => item.operatorId === operatorId);
}

export function readClubApplicationsByClub(clubId: string) {
  return readClubApplicationInbox().filter((item) => item.clubId === clubId);
}
