import {
  FieldGroup,
  SelectField,
} from '@/components/ui';

const contributionTitlePresets = [
  {
    id: 'standard',
    label: '标准梯队',
    labels: {
      rookie: '见习雀士',
      member: '正式队员',
      core: '主力队员',
      ace: '王牌队员',
    },
  },
  {
    id: 'ranked',
    label: '段位风格',
    labels: {
      rookie: '初巡新人',
      member: '牌桌常客',
      core: '上桌主将',
      ace: '雀坛王牌',
    },
  },
  {
    id: 'club',
    label: '俱乐部风格',
    labels: {
      rookie: '预备成员',
      member: '正式成员',
      core: '核心成员',
      ace: '明星成员',
    },
  },
] satisfies Array<{
  id: string;
  label: string;
  labels: Record<string, string>;
}>;

export function ClubContributionTitlePresetSelect({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (labels: Record<string, string>) => void;
}) {
  return (
    <FieldGroup>
      <SelectField
        label="头衔预设"
        value=""
        onChange={(event) => {
          const preset = contributionTitlePresets.find(
            (item) => item.id === event.currentTarget.value,
          );

          if (preset) {
            onSelect(preset.labels);
          }
        }}
        disabled={disabled}
      >
        <option value="">选择一套预设</option>
        {contributionTitlePresets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </SelectField>
    </FieldGroup>
  );
}
