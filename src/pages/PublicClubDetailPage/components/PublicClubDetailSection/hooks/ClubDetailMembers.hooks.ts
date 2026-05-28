import { useEffect, useMemo, useState } from 'react';

import {
  GetClubAPI,
  ListClubMemberPrivilegesAPI,
  ListClubMembersAPI,
} from '@/api/club';
import type { AuthSession } from '@/providers/auth/AuthSession';
import {
  hasClubAdminOverride,
  mapClubMember,
} from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type {
  ClubMemberPrivilegeSnapshotView,
  ClubRankNodeView,
  ListEnvelope,
} from '@/objects';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { ClubAdminMemberEntry } from '../../../objects/club-detail.types';
import {
  applyContributionTitleOverrides,
  buildContributionTitleFields,
} from '../../../objects/club-detail.contribution-titles';
import type { ClubPublicProfile } from '../../../objects/types';

interface UseClubDetailMembersParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  currentPlayerProfile: PlayerProfile | null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const [first] = value;
    return typeof first === 'string' ? first : null;
  }

  return null;
}

async function loadClubMemberAdminEntries(
  clubId: string,
  currentOperatorId: string,
  currentPlayer: PlayerProfile | null,
): Promise<ClubAdminMemberEntry[]> {
  const [club, membersEnvelope] = await Promise.all([
    sendAPI(new GetClubAPI(clubId)).catch(() => null),
    sendAPI(new ListClubMembersAPI(clubId, { limit: 100, offset: 0 })).then(
      (envelope) => mapEnvelope(envelope, mapClubMember),
    ),
  ]);
  const privilegeEnvelope = await sendAPI<
    ListEnvelope<ClubMemberPrivilegeSnapshotView>
  >(new ListClubMemberPrivilegesAPI(clubId, { limit: 100, offset: 0 })).catch(
    () => null,
  );
  const members = [...membersEnvelope.items];
  const adminIds = new Set(club?.admins ?? []);
  const privilegesByPlayerId = new Map(
    (privilegeEnvelope?.items ?? []).map((snapshot) => [
      snapshot.playerId,
      snapshot,
    ]),
  );

  return members
    .map((member) => {
      const privilegeSnapshot = privilegesByPlayerId.get(member.playerId);

      return {
        ...member,
        isAdmin:
          privilegeSnapshot?.isAdmin ||
          adminIds.has(member.playerId) ||
          hasClubAdminOverride(clubId, member.playerId),
        isCurrentUser:
          (!!currentPlayer && member.playerId === currentPlayer.playerId) ||
          (!currentPlayer &&
            !!member.applicantUserId &&
            member.applicantUserId === currentOperatorId),
        contribution: privilegeSnapshot?.contribution,
        rankCode: privilegeSnapshot?.rankCode,
        rankLabel: privilegeSnapshot?.rankLabel,
        privileges: privilegeSnapshot?.privileges,
        internalTitle: normalizeOptionalString(privilegeSnapshot?.internalTitle),
      };
    })
    .sort((left, right) => {
      if (left.isCurrentUser !== right.isCurrentUser) {
        return left.isCurrentUser ? -1 : 1;
      }

      if (left.isAdmin !== right.isAdmin) {
        return left.isAdmin ? -1 : 1;
      }

      return left.displayName.localeCompare(right.displayName);
    });
}

export function useClubDetailMembers({
  profile,
  session,
  currentPlayerProfile,
}: UseClubDetailMembersParams) {
  const [clubRankTree, setClubRankTree] = useState<ClubRankNodeView[]>([]);
  const [contributionTitleRefreshKey, setContributionTitleRefreshKey] =
    useState(0);
  const [clubMemberNames, setClubMemberNames] = useState<string[]>([]);
  const [clubMembers, setClubMembers] = useState<ClubAdminMemberEntry[]>([]);
  const [isClubMembersLoading, setIsClubMembersLoading] = useState(false);

  const contributionTitleFields = useMemo(
    () =>
      profile
        ? buildContributionTitleFields(
            clubMembers,
            clubRankTree,
          )
        : [],
    [clubMembers, clubRankTree, profile],
  );
  const displayClubMembers = useMemo(
    () => applyContributionTitleOverrides(clubMembers, contributionTitleFields),
    [clubMembers, contributionTitleFields],
  );

  async function refreshClubMembers() {
    if (!profile) {
      return;
    }

    setIsClubMembersLoading(true);

    try {
      const currentOperatorId =
        session?.user.operatorId ?? session?.user.userId ?? '';
      setClubMembers(
        await loadClubMemberAdminEntries(
          profile.id,
          currentOperatorId,
          currentPlayerProfile,
        ),
      );
    } catch {
      setClubMembers([]);
    } finally {
      setIsClubMembersLoading(false);
    }
  }

  useEffect(() => {
    if (!profile) {
      setClubRankTree([]);
      return;
    }

    let cancelled = false;

    void sendAPI(new GetClubAPI(profile.id))
      .then((club) => {
        if (!cancelled) {
          setClubRankTree(club.rankTree ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubRankTree([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contributionTitleRefreshKey, profile]);

  useEffect(() => {
    if (!profile) {
      setClubMemberNames([]);
      return;
    }

    let cancelled = false;

    void sendAPI(
      new ListClubMembersAPI(profile.id, { limit: 100, offset: 0 }),
    )
      .then((envelope) => mapEnvelope(envelope, mapClubMember))
      .then((envelope) => {
        if (!cancelled) {
          setClubMemberNames(
            envelope.items
              .map((item) => item.displayName)
              .filter((name) => name.trim().length > 0),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMemberNames([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      setClubMembers([]);
      setIsClubMembersLoading(false);
      return;
    }

    let cancelled = false;
    const currentOperatorId =
      session?.user.operatorId ?? session?.user.userId ?? '';
    setIsClubMembersLoading(true);

    void loadClubMemberAdminEntries(
      profile.id,
      currentOperatorId,
      currentPlayerProfile,
    )
      .then((entries) => {
        if (!cancelled) {
          setClubMembers(entries);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMembers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsClubMembersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentPlayerProfile, profile, session]);

  return {
    clubMemberNames,
    clubMembers: displayClubMembers,
    contributionTitleFields,
    setContributionTitleRefreshKey,
    isClubMembersLoading,
    refreshClubMembers,
  };
}
