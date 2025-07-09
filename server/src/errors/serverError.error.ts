import CustomError from "./custom.error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class ServerError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  errorCode = ReasonPhrases.INTERNAL_SERVER_ERROR;
  details: string;

  constructor(message: string, details: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, details);

    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}