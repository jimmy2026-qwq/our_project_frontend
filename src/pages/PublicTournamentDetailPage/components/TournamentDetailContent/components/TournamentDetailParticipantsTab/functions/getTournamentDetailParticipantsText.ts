import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

export const participantText = {
  participants: '\u53c2\u8d5b\u540d\u5355',
  clubSection: '\u4ff1\u4e50\u90e8\u53c2\u8d5b',
  playerSection: '\u4e2a\u4eba\u53c2\u8d5b',
  inviteClub: '\u9080\u8bf7\u4ff1\u4e50\u90e8',
  invitePlayer: '\u9080\u8bf7\u4e2a\u4eba',
  confirmed: '\u5df2\u786e\u5b9a',
  pending: '\u5f85\u786e\u5b9a',
  people: '\u4eba',
  clubs: '\u4e2a\u4ff1\u4e50\u90e8',
  members: '\u6210\u5458',
  power: '\u6218\u529b',
  elo: 'ELO',
  close: '\u5173\u95ed',
  confirmInvite: '\u786e\u8ba4\u9080\u8bf7',
  inviting: '\u9080\u8bf7\u4e2d...',
  chooseClub: '\u9009\u62e9\u4ff1\u4e50\u90e8',
  choosePlayer: '\u9009\u62e9\u73a9\u5bb6',
  noClubs:
    '\u5f53\u524d\u8fd8\u6ca1\u6709\u4ff1\u4e50\u90e8\u52a0\u5165\u8fd9\u573a\u6bd4\u8d5b\u3002',
  noPlayers:
    '\u5f53\u524d\u8fd8\u6ca1\u6709\u4e2a\u4eba\u53c2\u8d5b\u540d\u5355\u3002',
  noClubOptions: '\u6ca1\u6709\u53ef\u9080\u8bf7\u7684\u4ff1\u4e50\u90e8',
  noPlayerOptions: '\u6ca1\u6709\u53ef\u9080\u8bf7\u7684\u73a9\u5bb6',
  loadingMembers: '\u6b63\u5728\u52a0\u8f7d\u51fa\u6218\u540d\u5355...',
  noMembers: '\u8fd8\u6ca1\u6709\u63d0\u4ea4\u51fa\u6218\u540d\u5355\u3002',
  activeLineup: '\u51fa\u6218\u540d\u5355',
  reserveLineup: '\u66ff\u8865\u540d\u5355',
  active: '\u6d3b\u8dc3',
  inactive: '\u505c\u7528',
  banned: '\u5c01\u7981',
  unknownRank: '\u6bb5\u4f4d\u672a\u8bbe\u7f6e',
  expandClubs: '\u5c55\u5f00\u4ff1\u4e50\u90e8\u53c2\u8d5b\u540d\u5355',
  collapseClubs: '\u6536\u8d77\u4ff1\u4e50\u90e8\u53c2\u8d5b\u540d\u5355',
  expandPlayers: '\u5c55\u5f00\u4e2a\u4eba\u53c2\u8d5b\u540d\u5355',
  collapsePlayers: '\u6536\u8d77\u4e2a\u4eba\u53c2\u8d5b\u540d\u5355',
  expandMembers: '\u5c55\u5f00\u4ff1\u4e50\u90e8\u51fa\u6218\u540d\u5355',
  collapseMembers: '\u6536\u8d77\u4ff1\u4e50\u90e8\u51fa\u6218\u540d\u5355',
  inviteClubTitle: '\u9080\u8bf7\u4ff1\u4e50\u90e8\u53c2\u8d5b',
  invitePlayerTitle: '\u9080\u8bf7\u4e2a\u4eba\u53c2\u8d5b',
  inviteClubDescription:
    '\u9009\u62e9\u8981\u52a0\u5165\u8fd9\u573a\u8d5b\u4e8b\u7684\u4ff1\u4e50\u90e8\u3002',
  invitePlayerDescription:
    '\u9009\u62e9\u8981\u52a0\u5165\u8fd9\u573a\u8d5b\u4e8b\u7684\u6d3b\u8dc3\u73a9\u5bb6\u3002',
};

export function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case 'Active':
      return participantText.active;
    case 'Inactive':
      return participantText.inactive;
    case 'Banned':
      return participantText.banned;
    default:
      return status || participantText.active;
  }
}

export function getRankLabel(player: PlayerProfile) {
  const rank = player.currentRank;

  if (!rank) {
    return participantText.unknownRank;
  }

  if (rank.platform === 'Custom' && rank.tier === 'Unranked') {
    return participantText.unknownRank;
  }

  return rank.stars
    ? `${rank.platform} ${rank.tier} ${rank.stars}`
    : `${rank.platform} ${rank.tier}`;
}
