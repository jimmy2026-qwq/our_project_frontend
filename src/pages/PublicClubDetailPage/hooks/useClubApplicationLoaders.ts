import { useClubApplicationDirectoryLoader } from './useClubApplicationDirectoryLoader';
import { useClubApplicationPlayerLoader } from './useClubApplicationPlayerLoader';
import { useTrackedClubApplicationLoader } from './useTrackedClubApplicationLoader';

export function useClubApplicationLoaders() {
  return {
    ...useClubApplicationDirectoryLoader(),
    ...useClubApplicationPlayerLoader(),
    ...useTrackedClubApplicationLoader(),
  };
}
