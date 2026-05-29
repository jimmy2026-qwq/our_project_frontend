const CLUB_ADMIN_OVERRIDE_STORAGE_KEY = 'riichi-nexus.club-admin-overrides';

interface ClubAdminOverrideRecord {
  clubId: string;
  playerId: string;
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function readClubAdminOverrides(): ClubAdminOverrideRecord[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CLUB_ADMIN_OVERRIDE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeClubAdminOverrides(records: ClubAdminOverrideRecord[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    CLUB_ADMIN_OVERRIDE_STORAGE_KEY,
    JSON.stringify(records),
  );
}

export function hasClubAdminOverride(clubId: string, playerId: string) {
  return readClubAdminOverrides().some(
    (record) => record.clubId === clubId && record.playerId === playerId,
  );
}

export function upsertClubAdminOverride(clubId: string, playerId: string) {
  const records = readClubAdminOverrides();

  if (
    records.some(
      (record) => record.clubId === clubId && record.playerId === playerId,
    )
  ) {
    return;
  }

  writeClubAdminOverrides([...records, { clubId, playerId }]);
}
