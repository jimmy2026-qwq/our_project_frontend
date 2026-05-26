import { APIMessage } from '@/system/api';
import type {
  DictionaryNamespaceReminderActionView,
  ProcessDictionaryNamespaceRemindersRequest,
} from '@/objects/dictionary';

export class DictionaryProcessNamespaceRemindersAPI extends APIMessage<DictionaryNamespaceReminderActionView[]> {
  readonly operatorId: string;
  readonly asOf?: string;
  readonly dueSoonHours: number;
  readonly reminderIntervalHours: number;
  readonly escalationGraceHours: number;

  constructor(payload: ProcessDictionaryNamespaceRemindersRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.asOf = payload.asOf;
    this.dueSoonHours = payload.dueSoonHours ?? 24;
    this.reminderIntervalHours = payload.reminderIntervalHours ?? 12;
    this.escalationGraceHours = payload.escalationGraceHours ?? 72;
  }
}
