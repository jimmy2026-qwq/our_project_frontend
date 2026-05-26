export const DictionaryNamespaceReminderKinds = {
  DueSoon: 'DueSoon',
  Overdue: 'Overdue',
  Escalated: 'Escalated',
} as const;

export type DictionaryNamespaceReminderKind =
  (typeof DictionaryNamespaceReminderKinds)[keyof typeof DictionaryNamespaceReminderKinds];
