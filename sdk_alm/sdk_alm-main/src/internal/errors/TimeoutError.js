import { ALMError } from "./ALMError.js";

export class TimeoutError extends ALMError {
  constructor(
    message = "Request timeout",
    details = null
  ) {
    super(
      "ALM_TIMEOUT",
      message,
      details
    );
  }
}
