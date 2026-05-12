import ApiError from "./ApiError.js";

class NotFoundError extends ApiError {
  constructor(message = "Resource Not Found") {
    super(404, message);
  }
}

export default NotFoundError;
