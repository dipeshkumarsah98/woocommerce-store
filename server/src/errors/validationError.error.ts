import CustomError from "./custom.error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class ValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  errorCode = ReasonPhrases.BAD_REQUEST;
  details: string;

  constructor(message: string, details: string) {
    super(message, StatusCodes.BAD_REQUEST, details);

    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}