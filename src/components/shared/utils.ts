export function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}
