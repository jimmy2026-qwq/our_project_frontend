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
  const next = [item, ...items.filter((existing) => existing.id !== item.id)].slice(0, 20);
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
