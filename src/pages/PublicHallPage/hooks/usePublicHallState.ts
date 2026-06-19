import { useState } from 'react';

import {
  DEFAULT_PUBLIC_HALL_STATE,
  type PublicHallState,
} from '../objects/PublicHallPage.types';

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(
    DEFAULT_PUBLIC_HALL_STATE,
  );
  return { state, setState };
}
