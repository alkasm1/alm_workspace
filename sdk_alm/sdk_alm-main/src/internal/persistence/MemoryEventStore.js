import { BaseEventStore } from "./BaseEventStore.js";

export class MemoryEventStore extends BaseEventStore {
  constructor(maxEvents = 100) {
    super();

    this.events = [];
    this.maxEvents = maxEvents;
  }

  append(event) {
    if (!event) return null;

    const record = {
      id: this._generateId(),
      event,
      timestamp: Date.now()
    };

    this.events.push(record);

    // الاحتفاظ بآخر 100 حدث فقط
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(
        -this.maxEvents
      );
    }

    return record;
  }

  getAll() {
    return this.events;
  }

  getByType(type) {
    return this.events.filter(
      (record) =>
        record.event?.type === type
    );
  }

  clear() {
    this.events = [];
  }

  _generateId() {
    return (
      "evt_" +
      Date.now() +
      "_" +
      Math.random().toString(16).slice(2)
    );
  }
}
