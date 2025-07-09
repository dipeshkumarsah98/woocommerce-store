import CustomError from "./custom.error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class UnauthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  errorCode = ReasonPhrases.UNAUTHORIZED;
  details: string;

  constructor(message: string, details: string) {
    super(message, StatusCodes.UNAUTHORIZED, details);

    this.details = details;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}