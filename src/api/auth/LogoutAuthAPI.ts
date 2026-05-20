import { APIWithTokenMessage } from '@/system/api';
import type { ApiMessage } from '@/objects/auth';

export class LogoutAuthAPI extends APIWithTokenMessage<ApiMessage> {}
