import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import type { TournamentFormat } from '@/objects/tournament';
import type { PlayerLeaderboardEntry } from '@/pages/PublicHall/objects';
import {
  clubsApi,
  platformAdminApi,
  playerApi,
  tournamentApi,
} from '@/pages/PublicHall/objects/data.transport';
import {
  DEFAULT_PUBLIC_HALL_STATE,
} from '@/pages/PublicHall/objects/data.shared';
import type {
  HomeDataState,
  LeaderboardDataState,
  PublicHallState,
  PublicHallViewerContext,
} from '@/pages/PublicHall/objects/types';

import {
  loadPublicHallLeaderboardData,
  loadPublicHallHomeData,
  peekPublicHallHomeData,
  peekPublicHallLeaderboardData,
} from '../objects/data.home';

export type PlayerAdminAction = 'ban' | 'grantSuperAdmin';

const FORMAT_SWISS = '\u745e\u58eb\u8f6e';
const FORMAT_KNOCKOUT = '\u6dd8\u6c70\u8d5b';

function getDefaultStageName(name: string, format: TournamentFormat) {
  const trimmedName = name.trim();
  const suffix = format === 'Swiss' ? FORMAT_SWISS : FORMAT_KNOCKOUT;

  if (!trimmedName) {
    return `${suffix}\u9636\u6bb5`;
  }

  return `${trimmedName} ${suffix}`;
}

function getDefaultRoundCount(format: TournamentFormat) {
  return format === 'Swiss' ? 4 : 3;
}

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(
    DEFAULT_PUBLIC_HALL_STATE,
  );
  return { state, setState };
}

export function usePublicHallHomeData(
  state: PublicHallState,
  context: PublicHallViewerContext,
  reloadKey = 0,
) {
  const [data, setData] = useState<HomeDataState | null>(() =>
    peekPublicHallHomeData(state, context),
  );
  const [isLoading, setIsLoading] = useState(
    () => !peekPublicHallHomeData(state, context),
  );
  const [error, setError] = useState<string | null>(null);
  const session = context.session;
  const requestState = useMemo<PublicHallState>(
    () => ({
      activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
      scheduleTournamentStatus: state.scheduleTournamentStatus,
      scheduleStageStatus: state.scheduleStageStatus,
      leaderboardClubId: state.leaderboardClubId,
      leaderboardStatus: state.leaderboardStatus,
      clubActiveOnly: state.clubActiveOnly,
    }),
    [
      state.clubActiveOnly,
      state.leaderboardClubId,
      state.leaderboardStatus,
      state.scheduleStageStatus,
      state.scheduleTournamentStatus,
    ],
  );
  const requestContext = useMemo<PublicHallViewerContext>(
    () => ({ session }),
    [session],
  );

  useEffect(() => {
    let cancelled = false;
    const staleData = peekPublicHallHomeData(requestState, requestContext);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallHomeData(requestState, requestContext)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Public hall failed to render.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey, requestContext, requestState]);

  return { data, isLoading, error };
}

export function usePublicHallLeaderboardData(
  state: PublicHallState,
  homeData: HomeDataState | null,
  reloadKey = 0,
) {
  const [data, setData] = useState<LeaderboardDataState | null>(() =>
    peekPublicHallLeaderboardData(state),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestState = useMemo<PublicHallState>(
    () => ({
      activeView: DEFAULT_PUBLIC_HALL_STATE.activeView,
      scheduleTournamentStatus:
        DEFAULT_PUBLIC_HALL_STATE.scheduleTournamentStatus,
      scheduleStageStatus: DEFAULT_PUBLIC_HALL_STATE.scheduleStageStatus,
      leaderboardClubId: state.leaderboardClubId,
      leaderboardStatus: state.leaderboardStatus,
      clubActiveOnly: DEFAULT_PUBLIC_HALL_STATE.clubActiveOnly,
    }),
    [state.leaderboardClubId, state.leaderboardStatus],
  );

  useEffect(() => {
    if (!homeData) {
      return;
    }

    let cancelled = false;
    const staleData = peekPublicHallLeaderboardData(requestState);

    if (staleData) {
      setData(staleData);
    }

    setIsLoading(!staleData);
    setError(null);

    void loadPublicHallLeaderboardData(requestState, homeData.clubs)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Leaderboard failed to render.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [homeData, reloadKey, requestState]);

  return { data, isLoading, error };
}

export function usePublicHallCurrentPlayer(
  session: PublicHallViewerContext['session'],
  operatorId: string,
) {
  return useAsyncResource(async () => {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      return null;
    }

    return playerApi.getCurrentPlayer(operatorId);
  }, [operatorId, session?.user.roles.isRegisteredPlayer]);
}

export function useCreateClubDialogAction({
  open,
  name,
  onOpenChange,
}: {
  open: boolean;
  name: string;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    name.trim().length > 0 &&
    !isSubmitting;

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      notifyWarning('无法创建俱乐部', '当前账号没有创建俱乐部所需的权限。');
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      notifyWarning('请填写俱乐部名称', '俱乐部名称不能为空。');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await clubsApi.createClub({
        name: trimmedName,
        creatorId: operatorId,
      });
      notifySuccess(
        '俱乐部已创建',
        `${created.name} 已创建，当前账号已被设为俱乐部管理员。`,
      );
      onOpenChange(false);
      navigate(`/public/clubs/${created.id}`);
    } catch (error) {
      notifyWarning(
        '创建俱乐部失败',
        error instanceof Error ? error.message : '创建俱乐部时发生未知错误。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    canCreate,
    creatorName: session?.user.displayName ?? '',
    isSubmitting,
    handleSubmit,
  };
}

export function useCreateTournamentDialogAction({
  open,
  name,
  format,
  onOpenChange,
}: {
  open: boolean;
  name: string;
  format: TournamentFormat;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate =
    !!session?.user.roles.isSuperAdmin &&
    !!operatorId &&
    name.trim().length > 0 &&
    !isSubmitting;

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    if (!session?.user.roles.isSuperAdmin || !operatorId) {
      notifyWarning(
        '\u65e0\u6cd5\u521b\u5efa\u6bd4\u8d5b',
        '\u5f53\u524d\u8d26\u53f7\u6ca1\u6709\u521b\u5efa\u6bd4\u8d5b\u6240\u9700\u7684\u6743\u9650\u3002',
      );
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      notifyWarning(
        '\u8bf7\u586b\u5199\u8d5b\u4e8b\u540d\u79f0',
        '\u8d5b\u4e8b\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a\u3002',
      );
      return;
    }

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + 8 * 60 * 60 * 1000);

    try {
      setIsSubmitting(true);
      const created = await tournamentApi.createTournament({
        name: trimmedName,
        organizer: session.user.displayName || 'RiichiNexus',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        adminId: operatorId,
        stages: [
          {
            name: getDefaultStageName(trimmedName, format),
            format,
            order: 1,
            roundCount: getDefaultRoundCount(format),
            schedulingPoolSize: 4,
          },
        ],
      });

      notifySuccess(
        '\u6bd4\u8d5b\u5df2\u521b\u5efa',
        `${created.name} \u5df2\u521b\u5efa\uff0c\u6b63\u5728\u8fdb\u5165\u8d5b\u4e8b\u8be6\u60c5\u9875\u3002`,
      );
      onOpenChange(false);
      navigate(`/public/tournaments/${created.id}`);
    } catch (error) {
      notifyWarning(
        '\u521b\u5efa\u6bd4\u8d5b\u5931\u8d25',
        error instanceof Error
          ? error.message
          : '\u521b\u5efa\u6bd4\u8d5b\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\u3002',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    adminName: session?.user.displayName ?? '',
    canCreate,
    isSubmitting,
    handleSubmit,
  };
}

export function useManagePlayerDialogAction({
  open,
  player,
  action,
  reason,
  onOpenChange,
  onCompleted,
}: {
  open: boolean;
  player: PlayerLeaderboardEntry | null;
  action: PlayerAdminAction;
  reason: string;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
}) {
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorId = session?.user.operatorId ?? '';
  const trimmedReason = reason.trim();
  const canSubmit =
    !!player &&
    !!operatorId &&
    !isSubmitting &&
    (action === 'grantSuperAdmin' || trimmedReason.length > 0);

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    if (!player || !operatorId) {
      notifyWarning(
        '无法管理玩家',
        '当前账号缺少平台管理员操作所需的玩家身份。',
      );
      return;
    }

    if (action === 'ban' && !trimmedReason) {
      notifyWarning('请填写封禁原因', '封禁玩家时需要留下审计原因。');
      return;
    }

    try {
      setIsSubmitting(true);

      if (action === 'grantSuperAdmin') {
        await platformAdminApi.grantSuperAdmin(player.playerId, { operatorId });
        notifySuccess('已授权超管', `${player.nickname} 已获得平台超管权限。`);
      } else {
        await platformAdminApi.banPlayer(player.playerId, {
          operatorId,
          reason: trimmedReason,
        });
        notifySuccess('已封禁玩家', `${player.nickname} 已被封禁。`);
      }

      onCompleted?.();
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '玩家管理操作失败',
        error instanceof Error
          ? error.message
          : '提交玩家管理操作时发生未知错误。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    canSubmit,
    isSubmitting,
    handleSubmit,
  };
}
