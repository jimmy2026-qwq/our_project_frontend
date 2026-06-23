import { APIMessage } from '@/system/api';
import type { ClubPrivilegeDefinition } from '@/objects/club';

export class ClubPrivilegeDefinitionsAPI extends APIMessage<ClubPrivilegeDefinition[]> {}
