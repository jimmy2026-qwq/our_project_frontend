export interface DictionaryNamespaceReminderActionView {
  namespacePrefix: string;
  action: string;
  ownerPlayerId: string;
  occurredAt: string;
  note: string | null;
}
