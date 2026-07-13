import { RequestContract } from "../contracts/Request.js";
import { RequestIdGenerator } from "./RequestIdGenerator.js";

import { TimeoutError } from "../errors/TimeoutError.js";
import { TransportError } from "../errors/TransportError.js";

export class RequestManager {
  constructor({ registry, transport, pending, middleware }) {
    if (!registry || !transport || !pending || !middleware) {
      throw new Error("RequestManager missing dependencies");
    }

    this.registry = registry;
    this.transport = transport;
    this.pending = pending;
    this.middleware = middleware;
  }

  // =========================
  // Send Request (Core Path)
  // =========================
  async send({
    opcode,
    deviceId = null,
    payload = null,
    timeout = 30000,
    metadata = {}
  }) {
    const definition = this.registry.resolveOrThrow(opcode);
    const requestId = RequestIdGenerator.generate();

    const request = new RequestContract({
      requestId,
      opcode: definition.name,
      deviceId,
      payload,
      timeout,
      metadata
    });

    let timeoutId;

    const responsePromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        this.pending.reject(
          requestId,
          new TimeoutError("Request timed out", {
            requestId,
            opcode: definition.name
          })
        );
      }, timeout);

      this.pending.add(requestId, {
        resolve,
        reject,
        timeoutId
      });
    });

    try {
      await this.middleware.execute(
        { request, opcode: definition, transport: this.transport },
        async () => {
          await this.transport.send(request);
        }
      );
    } catch (error) {
      this._failRequest(requestId, definition, error);
      throw error;
    }

    return responsePromise;
  }

  // =========================
  // Response Handler
  // =========================
  handleResponse(response) {
    if (!response?.requestId) return;

    this.pending.resolve(response.requestId, response);
  }

  // =========================
  // Internal Error Handling
  // =========================
  _failRequest(requestId, definition, error) {
    try {
      this.pending.reject(
        requestId,
        new TransportError(error?.message || "Transport failed", {
          requestId,
          opcode: definition?.name,
          cause: error
        })
      );
    } catch (_) {
      // prevent cascade failure
    }
  }
}
