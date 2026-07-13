// src/internal/contracts/EventContract.js

export class EventContract {
  constructor({
    eventId,
    type,
    source = null,
    payload = null,
    version = 1,
    timestamp = Date.now()
  }) {
    this.eventId = eventId;
    this.type = type;
    this.source = source;
    this.payload = payload;
    this.version = version;
    this.timestamp = timestamp;
  }
}
