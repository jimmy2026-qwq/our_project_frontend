export const AppealAttachmentMediaKinds = {
  Image: 'Image',
  Video: 'Video',
  Document: 'Document',
  Log: 'Log',
  Archive: 'Archive',
  Other: 'Other',
} as const;

export type AppealAttachmentMediaKind =
  (typeof AppealAttachmentMediaKinds)[keyof typeof AppealAttachmentMediaKinds];
