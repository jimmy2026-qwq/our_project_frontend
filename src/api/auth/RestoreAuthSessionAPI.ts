import { APIWithTokenMessage } from '@/system/api';
import type { AuthSessionResponse } from '@/objects/auth';

export class RestoreAuthSessionAPI extends APIWithTokenMessage<AuthSessionResponse> {}
