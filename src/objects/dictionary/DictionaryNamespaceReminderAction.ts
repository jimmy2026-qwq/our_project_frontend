import type { DictionaryNamespaceReminderKind } from './DictionaryNamespaceReminderKind';

export interface DictionaryNamespaceReminderAction {
  namespacePrefix: string;
  contextClubId: string | null;
  ownerPlayerId: string;
  coOwnerPlayerIds: string[];
  editorPlayerIds: string[];
  reminderKind: DictionaryNamespaceReminderKind;
  triggeredAt: string;
  dueAt: string | null;
  reminderCount: number;
}
