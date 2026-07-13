export class EventStore {
  constructor(maxEvents = 100) {
    this.events = [];
    this.maxEvents = maxEvents;
  }

  append(event) {
    if (!event) return;

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
      (e) => e.event?.type === type
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
