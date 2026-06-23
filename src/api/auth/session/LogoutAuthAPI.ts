import { APIWithTokenMessage } from '@/system/api';
import type { LogoutResponse } from '@/objects/auth';

export class LogoutAuthAPI extends APIWithTokenMessage<LogoutResponse> {}
