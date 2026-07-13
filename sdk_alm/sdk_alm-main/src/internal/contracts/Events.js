// src/internal/contracts/Events.js

export class EventContract {
  constructor({
    eventId,
    type,
    source,
    payload,
    timestamp = Date.now()
  }) {
    this.eventId = eventId;
    this.type = type;
    this.source = source;
    this.payload = payload;
    this.timestamp = timestamp;
  }
}
