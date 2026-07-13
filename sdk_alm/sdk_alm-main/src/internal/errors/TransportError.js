import { ALMError } from "./ALMError.js";

export class TransportError extends ALMError {
  constructor(
    message = "Transport error",
    details = null
  ) {
    super(
      "ALM_TRANSPORT_ERROR",
      message,
      details
    );
  }
}
