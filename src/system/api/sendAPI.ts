import { sendJson } from '@/system/api/http';
import type { APIMessage } from './APIMessage';
import { apiNameOf } from './apiNameOf';

export async function sendAPI<Response>(message: APIMessage<Response>) {
  const headers = message.needsBearerToken
    ? { Authorization: `Bearer ${extractBearerToken(message)}` }
    : undefined;

  return sendJson<Response>(`/${apiNameOf(message)}`, 'POST', message, { headers });
}

function extractBearerToken(message: APIMessage<unknown>) {
  const token = (message as { bearerToken?: string }).bearerToken?.trim();

  if (!token) {
    throw new Error('Bearer token is required.');
  }

  return token;
}
