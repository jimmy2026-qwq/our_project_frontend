import type { Role } from './common';

export interface FeatureModule {
  id: string;
  title: string;
  summary: string;
  entities: string[];
  primaryRoles: Role[];
  routes: string[];
}

export interface RoleCapability {
  role: Role;
  description: string;
  landingRoute: string;
  canRead: string[];
  canWrite: string[];
}
