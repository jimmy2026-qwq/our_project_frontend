import { APIMessage } from './APIMessage';

export abstract class APIWithTokenMessage<Response> extends APIMessage<Response> {
  constructor(token: string) {
    super();
    Object.defineProperty(this, 'bearerToken', {
      value: token,
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }

  readonly bearerToken!: string;

  override get needsBearerToken() {
    return true;
  }
}
