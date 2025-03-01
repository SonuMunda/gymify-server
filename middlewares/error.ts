import httpStatus from "http-status";
import APIError from "../utils/ApiError";
import yup, { ValidationError } from "yup";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger";


const handler = (err: any, req: any, res: any, next: any) => {
  const response = {
    statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || httpStatus[500],
    type: err.type,
    uuid: err.uuid,
  };
  if (!response.uuid) delete response.uuid;

  res.status(response.statusCode).json(response);
};

const converter = (err: any, req: any, res: any, next: any) => {
  let convertedError = err;
  if (err instanceof ValidationError) {
    convertedError = new APIError(
      httpStatus.BAD_REQUEST,
      err?.errors?.join(", ") || "Validations have failed",
      "Validation Error"
    );
  } else if (!(err instanceof APIError)) {
    console.log("err", err.message);
    let uuid = uuidv4();
    logger.error({ uuid, ...err });
    convertedError = new APIError(
      err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[500],
      err.message || "API Error 2",
      uuid
    );
  }

  return handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound = (req: any, res: any, next: any) => {
  const err = new APIError(
    httpStatus.NOT_FOUND,
    "This API does not exist",
    "API Not found"
  );
  return handler(err, req, res, next);
};

export default { handler, notFound, converter };
