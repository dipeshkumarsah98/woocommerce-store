import CustomError from "./custom.error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  errorCode = ReasonPhrases.NOT_FOUND;
  details: string;

  constructor(message: string, details: string) {
    super(message, StatusCodes.NOT_FOUND, details);
    this.details = details;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}