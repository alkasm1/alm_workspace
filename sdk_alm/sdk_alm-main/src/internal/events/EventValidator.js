// src/internal/events/EventValidator.js

export class EventValidator {
  static validate(event) {
    if (!event) {
      throw new Error("Event is required");
    }

    if (!event.type) {
      throw new Error("Event.type is required");
    }

    if (!event.eventId) {
      throw new Error("Event.eventId is required");
    }

    return true;
  }
}
