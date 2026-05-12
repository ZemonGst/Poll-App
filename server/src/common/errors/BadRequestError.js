import ApiError from "./ApiError.js";

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export default BadRequestError;
