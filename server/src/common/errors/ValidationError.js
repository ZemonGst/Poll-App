import ApiError from "./ApiError.js";

class ValidationError extends ApiError {
  constructor(message = "Validation Error") {
    super(422, message);
  }
}

export default ValidationError;
