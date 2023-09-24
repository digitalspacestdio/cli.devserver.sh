export class AppwriteException extends Error {
  code: any;
  response: any;
  constructor(message: string, code?: any, response?: any) {
    super(message);
    this.code = code;
    this.response = response;
  }
}
