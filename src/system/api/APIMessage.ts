export abstract class APIMessage<Response> {
  declare readonly responseType: Response;

  get needsBearerToken() {
    return false;
  }
}
