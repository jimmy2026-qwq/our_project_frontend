import { ApiError, sendJson } from './http';
import { emptyBackendOption, encodeBackendOption } from './backend-option.transport';
import type { CreateTournamentPayload, SubmitStageLineupPayload } from '@/domain';

export async function postWithOperatorCompat<T>(path: string, operatorId?: string) {
  const rawBody = {
    operatorId,
  };

  try {
    return await sendJson<T>(path, 'POST', rawBody);
  } catch (error) {
    if (
      error instanceof ApiError &&
      operatorId &&
      /expected (sequence|string)|got (sequence|string|array)/i.test(error.message)
    ) {
      return sendJson<T>(path, 'POST', {
        operatorId: encodeBackendOption(operatorId),
      });
    }

    throw error;
  }
}

export function buildSubmitStageLineupRequest(payload: SubmitStageLineupPayload) {
  return {
    clubId: payload.clubId,
    operatorId: payload.operatorId,
    seats: payload.playerIds.map((playerId) => ({
      playerId,
      preferredWind: emptyBackendOption<string>(),
      reserve: false,
    })),
    note: payload.note ? [payload.note] : emptyBackendOption<string>(),
  };
}

export function buildCreateTournamentRequest(payload: CreateTournamentPayload) {
  return {
    name: payload.name,
    organizer: payload.organizer,
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    adminId: payload.adminId ? [payload.adminId] : emptyBackendOption<string>(),
    stages: [
      {
        id: emptyBackendOption<string>(),
        name: payload.stage.name,
        format: payload.stage.format,
        order: payload.stage.order ?? 1,
        roundCount: payload.stage.roundCount,
        operatorId: emptyBackendOption<string>(),
        ruleTemplateKey: emptyBackendOption<string>(),
        advancementRuleType: emptyBackendOption<string>(),
        cutSize: emptyBackendOption<number>(),
        thresholdScore: emptyBackendOption<number>(),
        targetTableCount: emptyBackendOption<number>(),
        schedulingPoolSize: [payload.stage.schedulingPoolSize ?? 4],
      },
    ],
  };
}
