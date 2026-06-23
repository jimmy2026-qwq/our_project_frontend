import { TournamentFormat } from '@/objects/tournament';

export function getTournamentFormatLabel(format: TournamentFormat) {
  return format === TournamentFormat.Swiss ? '\u745e\u58eb\u8f6e' : '\u6dd8\u6c70\u8d5b';
}
