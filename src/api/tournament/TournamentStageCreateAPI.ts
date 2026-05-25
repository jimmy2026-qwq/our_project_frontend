import { APIMessage } from '@/system/api';
import type { CreateTournamentStageRequest, TournamentSummaryView } from '@/objects';
import { emptyBackendOption } from '@/system/api/backend-option.transport';
import type { AdvancementRuleType, KnockoutSeedingPolicy, SwissPairingMethod } from '@/objects/tournament';

export class TournamentStageCreateAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly request: unknown;

  constructor(tournamentId: string, request: CreateTournamentStageRequest) {
    super();
    this.tournamentId = tournamentId;
    this.request = {
      id: request.id ? [request.id] : emptyBackendOption<string>(),
      name: request.name,
      format: request.format,
      order: request.order,
      roundCount: request.roundCount,
      operatorId: request.operatorId ? [request.operatorId] : emptyBackendOption<string>(),
      ruleTemplateKey: request.ruleTemplateKey ? [request.ruleTemplateKey] : emptyBackendOption<string>(),
      advancementRuleType: request.advancementRuleType ? [request.advancementRuleType] : emptyBackendOption<AdvancementRuleType>(),
      cutSize: request.cutSize === undefined ? emptyBackendOption<number>() : [request.cutSize],
      thresholdScore: request.thresholdScore === undefined ? emptyBackendOption<number>() : [request.thresholdScore],
      targetTableCount: request.targetTableCount === undefined ? emptyBackendOption<number>() : [request.targetTableCount],
      note: request.note ? [request.note] : emptyBackendOption<string>(),
      pairingMethod: request.pairingMethod ? [request.pairingMethod] : emptyBackendOption<SwissPairingMethod>(),
      carryOverPoints: request.carryOverPoints === undefined ? emptyBackendOption<boolean>() : [request.carryOverPoints],
      maxRounds: request.maxRounds === undefined ? emptyBackendOption<number>() : [request.maxRounds],
      bracketSize: request.bracketSize === undefined ? emptyBackendOption<number>() : [request.bracketSize],
      thirdPlaceMatch: request.thirdPlaceMatch === undefined ? emptyBackendOption<boolean>() : [request.thirdPlaceMatch],
      repechageEnabled: request.repechageEnabled === undefined ? emptyBackendOption<boolean>() : [request.repechageEnabled],
      seedingPolicy: request.seedingPolicy ? [request.seedingPolicy] : emptyBackendOption<KnockoutSeedingPolicy>(),
      schedulingPoolSize: request.schedulingPoolSize === undefined ? emptyBackendOption<number>() : [request.schedulingPoolSize],
    };
  }
}
