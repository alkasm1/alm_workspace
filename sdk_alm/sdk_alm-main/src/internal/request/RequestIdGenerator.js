// src/internal/request/RequestIdGenerator.js

export class RequestIdGenerator {
  static generate() {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}
