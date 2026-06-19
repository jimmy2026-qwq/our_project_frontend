export const AppealAttachmentStorageKinds = {
  ExternalUrl: 'ExternalUrl',
  ObjectStore: 'ObjectStore',
  SignedUrl: 'SignedUrl',
  InternalReference: 'InternalReference',
} as const;

export type AppealAttachmentStorageKind =
  (typeof AppealAttachmentStorageKinds)[keyof typeof AppealAttachmentStorageKinds];
