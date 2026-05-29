import { useEffect, useState } from 'react';

import { ListClubApplicationsAPI } from '@/api/club';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubApplicationView } from '@/pages/objects/ClubApplicationViews';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toClubApplicationView } from '../../../objects/ClubDetailApplication.mappers';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

interface UseClubApplicationInboxParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  canReviewApplications: boolean;
}

export function useClubApplicationInbox({
  profile,
  session,
  canReviewApplications,
}: UseClubApplicationInboxParams) {
  const [applicationInbox, setApplicationInbox] = useState<
    ClubApplicationView[]
  >([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);

  useEffect(() => {
    if (
      !session?.user.roles.isRegisteredPlayer ||
      !profile ||
      !canReviewApplications
    ) {
      setApplicationInbox([]);
      setIsInboxLoading(false);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    setIsInboxLoading(true);

    void sendAPI(
      new ListClubApplicationsAPI(profile.id, {
        operatorId,
        status: 'Pending',
        limit: 20,
        offset: 0,
      }),
    )
      .then((envelope) => mapEnvelope(envelope, toClubApplicationView))
      .then((envelope) => {
        if (!cancelled) {
          setApplicationInbox(envelope.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApplicationInbox([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsInboxLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canReviewApplications, profile, session]);

  return {
    applicationInbox,
    setApplicationInbox,
    isInboxLoading,
  };
}
