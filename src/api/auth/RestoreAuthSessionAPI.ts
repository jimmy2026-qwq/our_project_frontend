import { APIWithTokenMessage } from '@/system/api';
import type { AuthSessionView } from '@/objects/auth';

export class RestoreAuthSessionAPI extends APIWithTokenMessage<AuthSessionView> {}
