export interface ProcessDictionaryNamespaceRemindersRequest {
  operatorId: string;
  asOf?: string;
  dueSoonHours?: number;
  reminderIntervalHours?: number;
  escalationGraceHours?: number;
}
