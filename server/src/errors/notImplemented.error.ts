import CustomError from "./custom.error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class NotImplementedError extends CustomError {
  statusCode = StatusCodes.NOT_IMPLEMENTED;
  errorCode = ReasonPhrases.NOT_IMPLEMENTED;
  details: string;

  constructor(message: string, details: string) {
    super(message, StatusCodes.NOT_IMPLEMENTED, details);
    this.details = details;
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}