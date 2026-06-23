import type { ListEnvelope } from '@/objects';

export interface LoadState<T> {
  envelope: ListEnvelope<T>;
  warning?: string;
}
