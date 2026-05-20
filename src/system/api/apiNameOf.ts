import type { APIMessage } from './APIMessage';

export function apiNameOf(message: APIMessage<unknown>) {
  return message.constructor.name.toLowerCase();
}
