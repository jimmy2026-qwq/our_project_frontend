import type { ClubRankNode } from '@/objects';

import type {
  ClubAdminMemberEntry,
  ClubDetailWorkbenchState,
} from '../../../objects/ClubDetail.types';

const DEFAULT_CONTRIBUTION_TITLE_FIELDS = [
  { rankCode: 'rookie', defaultLabel: '见习雀士', minimumContribution: 0 },
  { rankCode: 'member', defaultLabel: '正式队员', minimumContribution: 500 },
  { rankCode: 'core', defaultLabel: '主力队员', minimumContribution: 1500 },
  { rankCode: 'ace', defaultLabel: '王牌队员', minimumContribution: 3000 },
] satisfies Array<{
  rankCode: string;
  defaultLabel: string;
  minimumContribution: number;
}>;

const LEGACY_MEMBER_TITLE = '成员';
const LEGACY_LABELS_BY_RANK_CODE = new Map<string, Set<string>>([
  ['rookie', new Set(['Rookie', '萌新', '新手'])],
  ['member', new Set(['Member', '同伴', '成员'])],
  ['core', new Set(['Core', '主力'])],
  ['ace', new Set(['Ace', '王牌'])],
]);

function normalizeTitle(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function isLegacyMemberTitle(value: string | null | undefined) {
  return normalizeTitle(value) === LEGACY_MEMBER_TITLE;
}

function normalizeContributionLabel(
  rankCode: string,
  value: string | null | undefined,
  fallback: string,
) {
  const label = normalizeTitle(value);

  if (!label) {
    return fallback;
  }

  if (LEGACY_LABELS_BY_RANK_CODE.get(rankCode)?.has(label)) {
    return fallback;
  }

  return label;
}

function defaultRankCodeForContribution(contribution: number | undefined) {
  if (typeof contribution !== 'number') {
    return null;
  }

  const matchingFields = DEFAULT_CONTRIBUTION_TITLE_FIELDS.filter(
    (field) => field.minimumContribution <= contribution,
  );
  const lastMatch = matchingFields[matchingFields.length - 1];

  return lastMatch?.rankCode ?? null;
}

export function buildContributionTitleFields(
  members: ClubAdminMemberEntry[],
  rankTree: ClubRankNode[],
): ClubDetailWorkbenchState['contributionTitleFields'] {
  const defaultsByCode = new Map(
    DEFAULT_CONTRIBUTION_TITLE_FIELDS.map((field, index) => [
      field.rankCode,
      { ...field, sortIndex: index },
    ]),
  );
  const observedLabelsByCode = new Map(
    members.flatMap((member) => {
      const label = normalizeTitle(member.rankLabel);

      if (!member.rankCode || !label || isLegacyMemberTitle(label)) {
        return [];
      }

      return [[member.rankCode, label] as const];
    }),
  );
  const rankTreeByCode = new Map(
    rankTree
      .filter((field) => field.code.trim())
      .map((field) => [field.code, field]),
  );
  const rankCodes = Array.from(
    new Set([
      ...DEFAULT_CONTRIBUTION_TITLE_FIELDS.map((field) => field.rankCode),
      ...rankTreeByCode.keys(),
      ...observedLabelsByCode.keys(),
    ]),
  );

  return rankCodes
    .map((rankCode) => {
      const defaultField = defaultsByCode.get(rankCode);
      const rankTreeField = rankTreeByCode.get(rankCode);
      const defaultLabel =
        defaultField?.defaultLabel ??
        observedLabelsByCode.get(rankCode) ??
        rankCode;
      const rawDisplayLabel =
        rankTreeField?.label?.trim() ||
        observedLabelsByCode.get(rankCode) ||
        defaultLabel;
      const displayLabel = normalizeContributionLabel(
        rankCode,
        rawDisplayLabel,
        defaultLabel,
      );

      return {
        rankCode,
        defaultLabel,
        displayLabel,
        minimumContribution:
          rankTreeField?.minimumContribution ??
          defaultField?.minimumContribution,
        privileges: rankTreeField?.privileges ?? [],
        sortIndex: defaultField?.sortIndex ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((left, right) => {
      if (left.sortIndex !== right.sortIndex) {
        return left.sortIndex - right.sortIndex;
      }

      return left.rankCode.localeCompare(right.rankCode, 'zh-CN');
    })
    .map(({ sortIndex: _sortIndex, ...field }) => field);
}

export function applyContributionTitleOverrides(
  members: ClubAdminMemberEntry[],
  fields: ClubDetailWorkbenchState['contributionTitleFields'],
): ClubAdminMemberEntry[] {
  const titleByRankCode = new Map(
    fields.map((field) => [field.rankCode, field.displayLabel]),
  );

  return members.map((member) => {
    const effectiveRankCode =
      !member.rankCode || isLegacyMemberTitle(member.rankLabel)
        ? defaultRankCodeForContribution(member.contribution)
        : member.rankCode;

    if (!effectiveRankCode) {
      return member;
    }

    const overriddenLabel = titleByRankCode.get(effectiveRankCode);

    if (!overriddenLabel || overriddenLabel === member.rankLabel) {
      return member;
    }

    return {
      ...member,
      rankCode: effectiveRankCode,
      rankLabel: overriddenLabel,
    };
  });
}
