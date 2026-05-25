export type BackendOption<T> = [] | [T];

export function encodeBackendOption<T>(value: T | undefined): BackendOption<T> {
  return value === undefined ? [] : [value];
}

export function emptyBackendOption<T>(): BackendOption<T> {
  return [];
}
