export const ClubRelationKinds = {
  Alliance: 'Alliance',
  Rivalry: 'Rivalry',
  Neutral: 'Neutral',
} as const;

export type ClubRelationKind = (typeof ClubRelationKinds)[keyof typeof ClubRelationKinds];
