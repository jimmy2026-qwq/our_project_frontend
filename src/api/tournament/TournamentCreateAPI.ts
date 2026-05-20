import { APIMessage } from '@/system/api';
import type { CreateTournamentRequest, TournamentSummaryView } from '@/objects';
import { emptyBackendOption } from '@/system/api/backend-option.transport';

export class TournamentCreateAPI extends APIMessage<TournamentSummaryView> {
  readonly name: string;
  readonly organizer: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly stages: unknown[];
  readonly adminId?: string;

  constructor(payload: CreateTournamentRequest) {
    super();
    this.name = payload.name;
    this.organizer = payload.organizer;
    this.startsAt = payload.startsAt;
    this.endsAt = payload.endsAt;
    this.adminId = payload.adminId;
    this.stages = payload.stages.map((stage) => ({
      id: stage.id ? [stage.id] : emptyBackendOption<string>(),
      name: stage.name,
      format: stage.format,
      order: stage.order,
      roundCount: stage.roundCount,
      operatorId: stage.operatorId ? [stage.operatorId] : emptyBackendOption<string>(),
      ruleTemplateKey: stage.ruleTemplateKey ? [stage.ruleTemplateKey] : emptyBackendOption<string>(),
      advancementRuleType: stage.advancementRuleType ? [stage.advancementRuleType] : emptyBackendOption<string>(),
      cutSize: stage.cutSize === undefined ? emptyBackendOption<number>() : [stage.cutSize],
      thresholdScore: stage.thresholdScore === undefined ? emptyBackendOption<number>() : [stage.thresholdScore],
      targetTableCount: stage.targetTableCount === undefined ? emptyBackendOption<number>() : [stage.targetTableCount],
      note: stage.note ? [stage.note] : emptyBackendOption<string>(),
      pairingMethod: stage.pairingMethod ? [stage.pairingMethod] : emptyBackendOption<string>(),
      carryOverPoints: stage.carryOverPoints === undefined ? emptyBackendOption<boolean>() : [stage.carryOverPoints],
      maxRounds: stage.maxRounds === undefined ? emptyBackendOption<number>() : [stage.maxRounds],
      bracketSize: stage.bracketSize === undefined ? emptyBackendOption<number>() : [stage.bracketSize],
      thirdPlaceMatch: stage.thirdPlaceMatch === undefined ? emptyBackendOption<boolean>() : [stage.thirdPlaceMatch],
      repechageEnabled: stage.repechageEnabled === undefined ? emptyBackendOption<boolean>() : [stage.repechageEnabled],
      seedingPolicy: stage.seedingPolicy ? [stage.seedingPolicy] : emptyBackendOption<string>(),
      schedulingPoolSize: stage.schedulingPoolSize === undefined ? emptyBackendOption<number>() : [stage.schedulingPoolSize],
    }));
  }
}
