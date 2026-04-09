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
    description: 'Can browse public surfaces, enter the personal workbench, and submit or withdraw club applications from the homepage flow.',
    landingRoute: '/member-hub',
    canRead: ['Player dashboard', 'Public club information', 'Own application status'],
    canWrite: ['Submit club application', 'Withdraw pending application'],
  },
  {
    role: 'ClubAdmin',
    description: 'Focuses on club-facing dashboard and application inbox work, especially reviewing membership requests.',
    landingRoute: '/member-hub',
    canRead: ['Club dashboard', 'Application inbox', 'Member overview'],
    canWrite: ['Review applications', 'Adjust recruitment policy', 'Maintain club operations info'],
  },
  {
    role: 'TournamentAdmin',
    description: 'Handles operational tournament views such as tables, records, and appeals.',
    landingRoute: '/tournament-ops',
    canRead: ['Tournament stages', 'Table status', 'Appeal queue'],
    canWrite: ['Advance tournament flow', 'Handle table state', 'Follow up appeals'],
  },
  {
    role: 'SuperAdmin',
    description: 'Platform-level governance role that remains outside the main frontend workbench focus for now.',
    landingRoute: '/admin/overview',
    canRead: ['Dictionary config', 'Audit trail', 'Global operations view'],
    canWrite: ['Maintain dictionary', 'Review audits', 'Apply platform-level configuration'],
  },
];
