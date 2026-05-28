import { useEffect, useState } from 'react';

import { AuthCheckPermissionAPI } from '@/api/auth';
import type { Permission } from '@/objects/auth';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';

import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

interface UseClubDetailPermissionsParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  currentMemberPrivileges: string[];
}

export function useClubDetailPermissions({
  profile,
  session,
  currentMemberPrivileges,
}: UseClubDetailPermissionsParams) {
  const [canViewContributionChanges, setCanViewContributionChanges] =
    useState(false);
  const [baseClubPermissions, setBaseClubPermissions] = useState({
    canAssignAdmins: false,
    canAdjustContributions: false,
    canEditTitles: false,
    canManageMembership: false,
  });

  const hasApproveRosterPrivilege =
    currentMemberPrivileges.includes('approve-roster');
  const canReviewApplications =
    baseClubPermissions.canManageMembership || hasApproveRosterPrivilege;
  const canRemoveMembers = canReviewApplications;
  const canAssignAdmins = baseClubPermissions.canAssignAdmins;
  const canAdjustContributions =
    baseClubPermissions.canAdjustContributions;
  const canEditTitles = baseClubPermissions.canEditTitles;

  useEffect(() => {
    if (!profile || !session) {
      setBaseClubPermissions({
        canAssignAdmins: false,
        canAdjustContributions: false,
        canEditTitles: false,
        canManageMembership: false,
      });
      return;
    }

    const operatorId = session.user.operatorId ?? session.user.userId;

    if (!operatorId) {
      setBaseClubPermissions({
        canAssignAdmins: false,
        canAdjustContributions: false,
        canEditTitles: false,
        canManageMembership: false,
      });
      return;
    }

    let cancelled = false;
    setBaseClubPermissions({
      canAssignAdmins: false,
      canAdjustContributions: false,
      canEditTitles: false,
      canManageMembership: false,
    });
    const check = (permission: Permission) =>
      sendAPI(
        new AuthCheckPermissionAPI({
          operatorId,
          permission,
          clubId: profile.id,
        }),
      )
        .catch(() => false);

    void Promise.all([
      check('AssignClubAdmin'),
      check('ManageClubOperations'),
      check('SetClubTitle'),
      check('ManageClubMembership'),
    ]).then(
      ([
        nextCanAssignAdmins,
        nextCanAdjustContributions,
        nextCanEditTitles,
        nextCanManageMembership,
      ]) => {
        if (!cancelled) {
          setBaseClubPermissions({
            canAssignAdmins: nextCanAssignAdmins,
            canAdjustContributions: nextCanAdjustContributions,
            canEditTitles: nextCanEditTitles,
            canManageMembership: nextCanManageMembership,
          });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [profile, session]);

  useEffect(() => {
    if (!profile || !session) {
      setCanViewContributionChanges(false);
      return;
    }

    const operatorId = session.user.operatorId ?? session.user.userId;

    if (!operatorId) {
      setCanViewContributionChanges(false);
      return;
    }

    let cancelled = false;
    setCanViewContributionChanges(false);

    void sendAPI(
      new AuthCheckPermissionAPI({
        operatorId,
        permission: 'ViewAuditTrail',
        clubId: profile.id,
      }),
    )
      .then((canView) => {
        if (!cancelled) {
          setCanViewContributionChanges(canView);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCanViewContributionChanges(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile, session]);

  return {
    canViewContributionChanges,
    canReviewApplications,
    canRemoveMembers,
    canAssignAdmins,
    canAdjustContributions,
    canEditTitles,
  };
}
