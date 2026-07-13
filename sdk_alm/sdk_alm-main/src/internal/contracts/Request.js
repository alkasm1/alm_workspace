// src/internal/contracts/Request.js

export class RequestContract {
  constructor({
    requestId,
    opcode,
    deviceId = null,
    payload = null,

    timeout = 30000,
    metadata = {
      sdkVersion: "0.1.0"
    },

    timestamp = Date.now()
  }) {
    this.requestId = requestId;
    this.opcode = opcode;
    this.deviceId = deviceId;
    this.payload = payload;

    this.timeout = timeout;
    this.metadata = metadata;

    this.timestamp = timestamp;
  }
}
