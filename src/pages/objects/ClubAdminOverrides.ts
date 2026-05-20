const CLUB_ADMIN_OVERRIDE_STORAGE_KEY = 'front-backend.club-admin-overrides';

interface ClubAdminOverrideRecord {
  clubId: string;
  playerId: string;
  grantedAt: string;
}

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function readRecords(): ClubAdminOverrideRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CLUB_ADMIN_OVERRIDE_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: ClubAdminOverrideRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CLUB_ADMIN_OVERRIDE_STORAGE_KEY, JSON.stringify(records));
}

export function hasClubAdminOverride(clubId: string, playerId: string) {
  return readRecords().some((record) => record.clubId === clubId && record.playerId === playerId);
}

export function upsertClubAdminOverride(clubId: string, playerId: string) {
  const records = readRecords().filter(
    (record) => !(record.clubId === clubId && record.playerId === playerId),
  );

  records.push({
    clubId,
    playerId,
    grantedAt: new Date().toISOString(),
  });

  writeRecords(records);
}
