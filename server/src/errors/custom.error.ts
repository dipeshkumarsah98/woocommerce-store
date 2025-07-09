export default class CustomError extends Error {
  statusCode: number;
  details: string;

  constructor(
    message: string,
    statusCode: number,
    details: string
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
