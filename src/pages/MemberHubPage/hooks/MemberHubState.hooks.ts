import { useEffect, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';

import {
  createMemberHubState,
  DEFAULT_MEMBER_HUB_STATE,
  loadMemberHubOperatorDirectory,
  type MemberHubOperatorDirectory,
  type MemberHubState,
} from '../objects/data';

export function useMemberHubState() {
  const { session } = useAuth();
  const [directory, setDirectory] = useState<MemberHubOperatorDirectory | null>(
    null,
  );
  const [state, setState] = useState<MemberHubState>(DEFAULT_MEMBER_HUB_STATE);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const nextDirectory = await loadMemberHubOperatorDirectory(session);

      if (!cancelled) {
        setDirectory(nextDirectory);
        setState((current) =>
          createMemberHubState(
            nextDirectory,
            current.operatorId ||
              session?.user.operatorId ||
              session?.user.userId,
          ),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { state, setState, directory };
}
