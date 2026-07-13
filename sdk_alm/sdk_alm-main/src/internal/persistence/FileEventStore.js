import fs from "fs";
import path from "path";
import { BaseEventStore } from "./BaseEventStore.js";

export class FileEventStore extends BaseEventStore {
  constructor(filePath = "./data/events.json") {
    super();

    this.filePath = filePath;
    this.maxEvents = 100;

    this._ensureStorage();
  }

  append(event) {
    if (!event) return null;

    const events = this.getAll();

    const record = {
      id: this._generateId(),
      event,
      timestamp: Date.now()
    };

    events.push(record);

    // الاحتفاظ بآخر 100 حدث فقط
    if (events.length > this.maxEvents) {
      events.splice(
        0,
        events.length - this.maxEvents
      );
    }

    this._write(events);

    return record;
  }

  getAll() {
    try {
      const raw = fs.readFileSync(
        this.filePath,
        "utf8"
      );

      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  getByType(type) {
    return this.getAll().filter(
      (record) =>
        record.event?.type === type
    );
  }

  clear() {
    this._write([]);
  }

  _write(events) {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(events, null, 2),
      "utf8"
    );
  }

  _ensureStorage() {
    const dir = path.dirname(this.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(
        this.filePath,
        "[]",
        "utf8"
      );
    }
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
