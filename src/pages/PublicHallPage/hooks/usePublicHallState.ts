import { useState } from 'react';

import { DEFAULT_PUBLIC_HALL_STATE } from '../objects/state';
import type { PublicHallState } from '../objects/types';

export function usePublicHallState() {
  const [state, setState] = useState<PublicHallState>(
    DEFAULT_PUBLIC_HALL_STATE,
  );
  return { state, setState };
}
