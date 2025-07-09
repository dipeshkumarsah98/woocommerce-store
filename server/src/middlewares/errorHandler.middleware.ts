import { Request, Response, NextFunction } from "express";
import errorResponse from "../utils/errorResponse.utils";
import CustomError from "../errors/custom.error";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import httpLogger from "../services/logger.service";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): Response => {
  httpLogger.error(`Error: ${error.message}`, {
    error: error.message,
    stack: error.stack,
  });

  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .json(errorResponse(error.message, error.statusCode));
  }

  return res
    .status(500)
    .json(
      errorResponse(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    );
};

export default errorHandler;