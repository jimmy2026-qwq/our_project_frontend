import {
  ActionButton,
  FieldGroup,
  TextInputField,
} from '@/components/ui';

import type { ClubContributionTitleField } from '../../../objects/ClubDetail.types';

/** 贡献称号设置弹窗中的单条称号字段卡。 */
export function ClubContributionTitleFieldCard({
  canManage,
  draftLabel,
  field,
  isSubmitting,
  onLabelChange,
  onRestoreDefault,
}: {
  canManage: boolean;
  draftLabel: string;
  field: ClubContributionTitleField;
  isSubmitting: boolean;
  onLabelChange: (value: string) => void;
  onRestoreDefault: () => void;
}) {
  return (
    <div className="grid gap-3 border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)] sm:items-center">
      <div className="grid gap-1">
        <strong className="text-[#f2f7fb]">{field.displayLabel}</strong>
        <span className="text-sm leading-6 text-[#9ab0c1]">
          等级 {field.rankCode}
          {typeof field.minimumContribution === 'number'
            ? ' / 贡献值 ≥ ' + field.minimumContribution
            : ''}
        </span>
        <span className="text-sm leading-6 text-[#c7d6e2]">
          默认显示为 {field.defaultLabel}
        </span>
      </div>

      {canManage ? (
        <FieldGroup>
          <TextInputField
            label="显示名称"
            value={draftLabel}
            onChange={(event) => onLabelChange(event.currentTarget.value)}
            disabled={isSubmitting}
          />
          <ActionButton
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={onRestoreDefault}
          >
            恢复默认
          </ActionButton>
        </FieldGroup>
      ) : null}
    </div>
  );
}
