export const SessionPrincipalKinds = {
  Anonymous: 'Anonymous',
  Guest: 'Guest',
  RegisteredPlayer: 'RegisteredPlayer',
} as const;

export type SessionPrincipalKind =
  (typeof SessionPrincipalKinds)[keyof typeof SessionPrincipalKinds];
