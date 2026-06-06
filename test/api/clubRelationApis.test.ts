import { describe, expect, it } from 'vitest';

import { SubmitClubRelationRequestAPI } from '@/api/club/SubmitClubRelationRequestAPI';
import { UpdateClubRelationAPI } from '@/api/club/UpdateClubRelationAPI';
import { encodeBackendOption, emptyBackendOption } from '@/system/api/backend-option.transport';
import { apiNameOf } from '@/system/api/apiNameOf';

describe('club relation API messages', () => {
  it('encodes direct relation updates with optional notes', () => {
    const message = new UpdateClubRelationAPI('club-a', {
      operatorId: 'player-super',
      targetClubId: 'club-b',
      relation: 'Alliance',
      note: 'approved by platform',
    });

    expect(apiNameOf(message)).toBe('updateclubrelationapi');
    expect(message.clubId).toBe('club-a');
    expect(message.operatorId).toBe('player-super');
    expect(message.targetClubId).toBe('club-b');
    expect(message.relation).toBe('Alliance');
    expect(message.note).toEqual(['approved by platform']);
  });

  it('encodes relation requests without mutating relation state directly', () => {
    const message = new SubmitClubRelationRequestAPI('club-a', {
      operatorId: 'player-club-admin',
      targetClubId: 'club-b',
      relation: 'Rivalry',
    });

    expect(apiNameOf(message)).toBe('submitclubrelationrequestapi');
    expect(message.clubId).toBe('club-a');
    expect(message.operatorId).toBe('player-club-admin');
    expect(message.targetClubId).toBe('club-b');
    expect(message.relation).toBe('Rivalry');
    expect(message.note).toEqual([]);
  });

  it('keeps backend option transport explicit for missing values', () => {
    expect(encodeBackendOption('note')).toEqual(['note']);
    expect(encodeBackendOption(undefined)).toEqual([]);
    expect(emptyBackendOption()).toEqual([]);
  });
});
