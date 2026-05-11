import { authApi } from './auth';
import { clubsApi } from './clubs';
import { operationsApi } from './operations';
import { publicApi } from './public';

export const apiClient = {
  ...authApi,
  ...publicApi,
  ...clubsApi,
  ...operationsApi,
};
