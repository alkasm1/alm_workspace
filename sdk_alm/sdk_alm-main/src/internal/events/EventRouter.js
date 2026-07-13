// src/internal/events/EventRouter.js

export class EventRouter {
  constructor() {
    this.emitter = new EventEmitter();
  }

  handle(event) {
    if (!event || typeof event !== "object") return;

    // =========================
    // enforce minimal contract shape
    // =========================
    const type = event.type || "runtime.event";

    // raw stream
    this.emitter.emit("raw", event);

    // typed routing
    this.emitter.emit(type, event);

    switch (type) {
      case "device.event":
        this.emitter.emit("device.event", event);
        break;

      case "task.event":
        this.emitter.emit("task.event", event);
        break;

      default:
        this.emitter.emit("runtime.event", event);
    }
  }

  on(eventName, handler) {
    this.emitter.on(eventName, handler);
  }

  off(eventName, handler) {
    this.emitter.off(eventName, handler);
  }
}
