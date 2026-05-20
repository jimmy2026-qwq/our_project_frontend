type QueryValue = string | number | boolean | undefined;

export function toQueryString<T extends object>(params: T) {
  const search = new URLSearchParams();

  Object.entries(params as Record<string, QueryValue>).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }

    search.set(key, String(value));
  });

  const output = search.toString();
  return output ? `?${output}` : '';
}
