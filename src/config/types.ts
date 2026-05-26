import type { Role } from '@/objects/auth';

export interface FeatureModule {
  id: string;
  title: string;
  summary: string;
  entities: string[];
  primaryRoles: Role[];
  frontendRoutes?: string[];
  apiMessages?: string[];
  apiDomains?: string[];
}

export interface RoleCapability {
  role: Role;
  description: string;
  landingRoute: string;
  canRead: string[];
  canWrite: string[];
}
