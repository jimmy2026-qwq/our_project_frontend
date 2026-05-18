export function encodeBackendOption<T>(value: T | undefined) {
  return value === undefined ? [] : [value];
}

export function emptyBackendOption<T>() {
  return [] as T[];
}
