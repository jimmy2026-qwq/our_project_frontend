import { APIMessage } from '@/system/api';
import type { ConfigureStageRulesRequest, TournamentSummaryView } from '@/objects';
import { emptyBackendOption } from '@/system/api/backend-option.transport';
import type {
  AdvancementRuleType,
  KnockoutSeedingPolicy,
  SwissPairingMethod,
  TournamentFormat,
} from '@/objects/tournament';

export class TournamentStageConfigureRulesAPI extends APIMessage<TournamentSummaryView> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: unknown;

  constructor(tournamentId: string, stageId: string, request: ConfigureStageRulesRequest) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.request = {
      operatorId: request.operatorId,
      format: request.format ? [request.format] : emptyBackendOption<TournamentFormat>(),
      roundCount: request.roundCount === undefined ? emptyBackendOption<number>() : [request.roundCount],
      advancementRuleType: request.advancementRuleType ? [request.advancementRuleType] : emptyBackendOption<AdvancementRuleType>(),
      cutSize: request.cutSize === undefined ? emptyBackendOption<number>() : [request.cutSize],
      thresholdScore: request.thresholdScore === undefined ? emptyBackendOption<number>() : [request.thresholdScore],
      targetTableCount: request.targetTableCount === undefined ? emptyBackendOption<number>() : [request.targetTableCount],
      schedulingPoolSize: request.schedulingPoolSize === undefined ? emptyBackendOption<number>() : [request.schedulingPoolSize],
      ruleTemplateKey: request.ruleTemplateKey ? [request.ruleTemplateKey] : emptyBackendOption<string>(),
      pairingMethod: request.pairingMethod ? [request.pairingMethod] : emptyBackendOption<SwissPairingMethod>(),
      carryOverPoints: request.carryOverPoints === undefined ? emptyBackendOption<boolean>() : [request.carryOverPoints],
      maxRounds: request.maxRounds === undefined ? emptyBackendOption<number>() : [request.maxRounds],
      bracketSize: request.bracketSize === undefined ? emptyBackendOption<number>() : [request.bracketSize],
      thirdPlaceMatch: request.thirdPlaceMatch === undefined ? emptyBackendOption<boolean>() : [request.thirdPlaceMatch],
      repechageEnabled: request.repechageEnabled === undefined ? emptyBackendOption<boolean>() : [request.repechageEnabled],
      seedingPolicy: request.seedingPolicy ? [request.seedingPolicy] : emptyBackendOption<KnockoutSeedingPolicy>(),
      mahjongRuleset: request.mahjongRuleset ? [request.mahjongRuleset] : emptyBackendOption(),
      note: request.note ? [request.note] : emptyBackendOption<string>(),
    };
  }
}
