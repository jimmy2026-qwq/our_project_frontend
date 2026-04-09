import type { RoleCapability } from '@/domain';

export const roleCapabilities: RoleCapability[] = [
  {
    role: 'Guest',
    description: 'Public browsing role focused on schedules, clubs, and leaderboard views without operational permissions.',
    landingRoute: '/public',
    canRead: ['Public schedules', 'Public club detail', 'Player leaderboard'],
    canWrite: [],
  },
  {
    role: 'RegisteredPlayer',
    description: 'Can browse public surfaces, enter match pages, and submit or withdraw club applications from the homepage flow.',
    landingRoute: '/public',
    canRead: ['Public schedules', 'Public club information', 'Own application status'],
    canWrite: ['Submit club application', 'Withdraw pending application'],
  },
  {
    role: 'ClubAdmin',
    description: 'Reviews club membership requests and manages club-facing actions directly from club and tournament detail pages.',
    landingRoute: '/public',
    canRead: ['Public club detail', 'Application inbox', 'Member overview'],
    canWrite: ['Review applications', 'Submit tournament lineups', 'Maintain club operations info'],
  },
  {
    role: 'TournamentAdmin',
    description: 'Handles operational tournament actions from tournament detail pages.',
    landingRoute: '/public',
    canRead: ['Tournament stages', 'Table status', 'Appeal queue'],
    canWrite: ['Advance tournament flow', 'Handle table state', 'Follow up appeals'],
  },
  {
    role: 'SuperAdmin',
    description: 'Platform-level governance role with access to public workflows plus elevated administration.',
    landingRoute: '/public',
    canRead: ['Dictionary config', 'Audit trail', 'Global operations view'],
    canWrite: ['Maintain dictionary', 'Review audits', 'Apply platform-level configuration'],
  },
];
