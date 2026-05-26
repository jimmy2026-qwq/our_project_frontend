export interface AccountCredential {
  username: string;
  playerId: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}
