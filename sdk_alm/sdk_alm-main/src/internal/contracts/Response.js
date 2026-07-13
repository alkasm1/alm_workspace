// src/internal/contracts/Response.js

export class ResponseContract {
  constructor({
    requestId,
    success,

    duration = 0,
    result = null,
    error = null,

    timestamp = Date.now()
  }) {
    this.requestId = requestId;
    this.success = success;

    this.duration = duration;
    this.result = result;
    this.error = error;

    this.timestamp = timestamp;
  }
}
