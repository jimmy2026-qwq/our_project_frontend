import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendAPIMock = vi.hoisted(() => vi.fn());

vi.mock('@/system/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/system/api')>();
  return {
    ...actual,
    sendAPI: sendAPIMock,
  };
});

import { SubmitClubRelationRequestAPI } from '@/api/club/SubmitClubRelationRequestAPI';
import { UpdateClubRelationAPI } from '@/api/club/UpdateClubRelationAPI';
import { useClubRelationActions } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/hooks/useClubRelationActions';
import type { ClubDetailActionContext } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/hooks/useClubDetailActions.types';
import type { ClubDetailWorkbenchState } from '@/pages/PublicClubDetailPage/objects/ClubDetail.types';
import type { ClubPublicProfile } from '@/pages/PublicClubDetailPage/objects/PublicClubDetailPage.types';

describe('useClubRelationActions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sendAPIMock.mockResolvedValue({});
  });

  it('sends direct relation updates only through the super admin path', async () => {
    const context = buildContext({
      operatorId: 'player-super',
      canManageRelations: true,
      canRequestRelationChange: false,
    });
    const actions = useClubRelationActions(context);

    await actions.handleUpdateRelation({
      targetClubId: ' club-b ',
      relation: 'Alliance',
      note: ' approved by platform ',
    });

    const message = sendAPIMock.mock.calls[0]?.[0];

    expect(message).toBeInstanceOf(UpdateClubRelationAPI);
    expect(message).toMatchObject({
      clubId: 'club-a',
      operatorId: 'player-super',
      targetClubId: 'club-b',
      relation: 'Alliance',
      note: ['approved by platform'],
    });
    expect(context.notifyMutationResult).toHaveBeenCalledWith(
      { source: 'api' },
      expect.objectContaining({ successTitle: '关系已更新' }),
    );
    expect(context.data.setIsRelationDialogOpen).toHaveBeenCalledWith(false);
    expect(context.onRefreshDetail).toHaveBeenCalledTimes(1);
  });

  it('sends ordinary club admin relation changes as requests', async () => {
    const context = buildContext({
      operatorId: 'player-club-admin',
      canManageRelations: false,
      canRequestRelationChange: true,
    });
    const actions = useClubRelationActions(context);

    await actions.handleUpdateRelation({
      targetClubId: 'club-b',
      relation: 'Rivalry',
    });

    const message = sendAPIMock.mock.calls[0]?.[0];

    expect(message).toBeInstanceOf(SubmitClubRelationRequestAPI);
    expect(message).toMatchObject({
      clubId: 'club-a',
      operatorId: 'player-club-admin',
      targetClubId: 'club-b',
      relation: 'Rivalry',
      note: [],
    });
    expect(context.notifyMutationResult).toHaveBeenCalledWith(
      { source: 'api' },
      expect.objectContaining({
        successTitle: '申请已提交',
        successMessage: '关系调整申请已经发送给平台超管。',
      }),
    );
  });

  it('does not submit without relation permission or for self relations', async () => {
    const noPermission = buildContext({
      operatorId: 'player-regular',
      canManageRelations: false,
      canRequestRelationChange: false,
    });
    const selfRelation = buildContext({
      operatorId: 'player-super',
      canManageRelations: true,
      canRequestRelationChange: false,
    });

    await useClubRelationActions(noPermission).handleUpdateRelation({
      targetClubId: 'club-b',
      relation: 'Alliance',
    });
    await useClubRelationActions(selfRelation).handleUpdateRelation({
      targetClubId: 'club-a',
      relation: 'Alliance',
    });

    expect(sendAPIMock).not.toHaveBeenCalled();
    expect(noPermission.data.setIsRelationSubmitting).not.toHaveBeenCalled();
    expect(selfRelation.data.setIsRelationSubmitting).not.toHaveBeenCalled();
  });
});

function buildContext(
  workbenchPatch: Pick<
    ClubDetailWorkbenchState,
    'operatorId' | 'canManageRelations' | 'canRequestRelationChange'
  >,
) {
  return {
    data: {
      setIsRelationDialogOpen: vi.fn(),
      setIsRelationSubmitting: vi.fn(),
    },
    notifyMutationResult: vi.fn(),
    onRefreshDetail: vi.fn(),
    profile: {
      id: 'club-a',
      name: 'Alpha Club',
    } as ClubPublicProfile,
    workbench: {
      ...workbenchPatch,
    } as ClubDetailWorkbenchState,
  } as unknown as ClubDetailActionContext;
}
