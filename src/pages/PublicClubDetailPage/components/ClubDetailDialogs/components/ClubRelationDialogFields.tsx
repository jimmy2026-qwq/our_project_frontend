import {
  Alert,
  FieldGroup,
  SelectField,
  TextareaField,
} from '@/components/ui';
import type {
  ClubRelationKind,
  PublicClubDirectoryEntry,
} from '@/objects/club';
import { ClubRelationKinds } from '@/objects/club';

const relationOptions: Array<{ value: ClubRelationKind; label: string }> = [
  { value: ClubRelationKinds.Alliance, label: '联盟' },
  { value: ClubRelationKinds.Rivalry, label: '对抗' },
  { value: ClubRelationKinds.Neutral, label: '中立' },
];

export function ClubRelationDialogFields({
  isLoading,
  isSubmitting,
  loadError,
  note,
  relation,
  selectableClubs,
  targetClubId,
  onNoteChange,
  onRelationChange,
  onTargetClubIdChange,
}: {
  isLoading: boolean;
  isSubmitting: boolean;
  loadError: string;
  note: string;
  relation: ClubRelationKind;
  selectableClubs: PublicClubDirectoryEntry[];
  targetClubId: string;
  onNoteChange: (value: string) => void;
  onRelationChange: (value: ClubRelationKind) => void;
  onTargetClubIdChange: (value: string) => void;
}) {
  return (
    <FieldGroup>
      {loadError ? <Alert variant="warning">{loadError}</Alert> : null}
      <SelectField
        label="目标俱乐部"
        value={targetClubId}
        onChange={(event) => onTargetClubIdChange(event.currentTarget.value)}
        disabled={isLoading || isSubmitting || selectableClubs.length === 0}
      >
        {selectableClubs.length === 0 ? (
          <option value="">暂无可选俱乐部</option>
        ) : null}
        {selectableClubs.map((club) => (
          <option key={club.clubId} value={club.clubId}>
            {club.name}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="关系"
        value={relation}
        onChange={(event) =>
          onRelationChange(event.currentTarget.value as ClubRelationKind)
        }
        disabled={isSubmitting}
      >
        {relationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
      <TextareaField
        label="备注"
        value={note}
        rows={3}
        placeholder="可选"
        onChange={(event) => onNoteChange(event.currentTarget.value)}
        disabled={isSubmitting}
      />
    </FieldGroup>
  );
}
