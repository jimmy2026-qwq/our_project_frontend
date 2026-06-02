import {
  isProvisionalClubApplicationId,
  readTrackedClubApplication,
  readTrackedClubApplicationsByPlayer,
} from './getClubApplicationTracker';

export function getTrackedApplication(
  playerId: string,
  clubId: string,
  applicationId?: string,
) {
  if (applicationId) {
    const tracked = readTrackedClubApplication(applicationId);

    if (tracked?.clubId === clubId) {
      return tracked;
    }
  }

  return (
    readTrackedClubApplicationsByPlayer(playerId)
      .filter((item) => item.clubId === clubId)
      .sort((left, right) => {
        const leftProvisional = isProvisionalClubApplicationId(left.id);
        const rightProvisional = isProvisionalClubApplicationId(right.id);

        if (leftProvisional !== rightProvisional) {
          return leftProvisional ? 1 : -1;
        }

        return Date.parse(right.submittedAt) - Date.parse(left.submittedAt);
      })[0] ?? null
  );
}
