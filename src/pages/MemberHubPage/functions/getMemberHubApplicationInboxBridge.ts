import type { MemberHubApplicationInboxItem } from '../objects/MemberHub.types';

const STORAGE_KEY = 'riichi-nexus.member-hub-application-inbox';

function canUseStorage() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function readMemberHubApplicationInbox(): MemberHubApplicationInboxItem[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return (JSON.parse(raw) as unknown[])
      .map(normalizeMemberHubApplicationInboxItem)
      .filter((item): item is MemberHubApplicationInboxItem => item !== null);
  } catch {
    return [];
  }
}

function normalizeMemberHubApplicationInboxItem(
  value: unknown,
): MemberHubApplicationInboxItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Partial<MemberHubApplicationInboxItem> & {
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

function writeMemberHubApplicationInbox(
  items: MemberHubApplicationInboxItem[],
) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function readMemberHubApplicationsByClub(clubId: string) {
  return readMemberHubApplicationInbox().filter(
    (item) => item.clubId === clubId,
  );
}

export function upsertMemberHubApplicationInboxItem(
  item: MemberHubApplicationInboxItem,
) {
  const items = readMemberHubApplicationInbox();
  const next = [
    item,
    ...items.filter((existing) => existing.id !== item.id),
  ].slice(0, 20);
  writeMemberHubApplicationInbox(next);
}
