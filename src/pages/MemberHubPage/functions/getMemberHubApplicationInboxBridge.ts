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
    return JSON.parse(raw) as MemberHubApplicationInboxItem[];
  } catch {
    return [];
  }
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
