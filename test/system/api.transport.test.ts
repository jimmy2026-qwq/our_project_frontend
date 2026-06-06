import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  APIMessage,
  APIWithTokenMessage,
  ApiError,
  mapEnvelope,
  request,
  sendAPI,
  sendJson,
  toQueryString,
} from '@/system/api';

class PublicPingAPI extends APIMessage<{ ok: boolean }> {}

class PrivatePingAPI extends APIWithTokenMessage<{ ok: boolean }> {}

describe('system api transport', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds query strings while dropping empty filters', () => {
    expect(
      toQueryString({
        status: 'Active',
        limit: 20,
        offset: 0,
        empty: '',
        missing: undefined,
        includeArchived: false,
      }),
    ).toBe('?status=Active&limit=20&offset=0&includeArchived=false');
    expect(toQueryString({ empty: '', missing: undefined })).toBe('');
  });

  it('maps envelopes without dropping pagination metadata', () => {
    expect(
      mapEnvelope(
        {
          items: [1, 2],
          total: 2,
          limit: 20,
          offset: 0,
          hasMore: false,
          appliedFilters: { status: 'Active' },
        },
        (item) => `#${item}`,
      ),
    ).toEqual({
      items: ['#1', '#2'],
      total: 2,
      limit: 20,
      offset: 0,
      hasMore: false,
      appliedFilters: { status: 'Active' },
    });
  });

  it('reads successful get and post JSON responses', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ value: 1 }))
      .mockResolvedValueOnce(jsonResponse({ saved: true }));

    await expect(request<{ value: number }>('/ping')).resolves.toEqual({
      value: 1,
    });
    await expect(
      sendJson<{ saved: boolean }>('/ping', 'POST', { value: 1 }),
    ).resolves.toEqual({ saved: true });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/ping', {
      headers: undefined,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/ping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: 1 }),
    });
  });

  it('turns JSON and text error responses into ApiError instances', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ detail: 'bad json request' }, { status: 422 }),
      )
      .mockResolvedValueOnce(
        new Response('plain failure', {
          status: 500,
          headers: { 'content-type': 'text/plain' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ message: 'typed failure' }, { status: 409 }),
      );

    await expect(request('/bad-json')).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'bad json request',
    });
    await expect(sendJson('/bad-text', 'POST', {})).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      message: 'plain failure',
    });
    await expect(request('/bad-typed')).rejects.toBeInstanceOf(ApiError);
  });

  it('sends API messages with derived names and bearer headers when required', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    await expect(sendAPI(new PublicPingAPI())).resolves.toEqual({ ok: true });
    await expect(sendAPI(new PrivatePingAPI(' token-123 '))).resolves.toEqual({
      ok: true,
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/publicpingapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/privatepingapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123',
      },
      body: JSON.stringify({}),
    });
  });

  it('rejects bearer API messages without a non-empty token', async () => {
    await expect(sendAPI(new PrivatePingAPI(' '))).rejects.toThrow(
      'Bearer token is required.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function jsonResponse(payload: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  });
}
