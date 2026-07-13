// src/internal/events/contracts/RuntimeEventContract.js

export class RuntimeEventContract {
  constructor({
    type = "runtime.event",
    name,
    payload = {},
    timestamp = Date.now()
  }) {
    this.type = type;
    this.name = name;
    this.payload = payload;
    this.timestamp = timestamp;
  }

  // =========================
  // Validation Layer
  // =========================
  static validate(event) {
    if (!event || typeof event !== "object") return false;

    if (event.type !== "runtime.event") return false;

    if (typeof event.name !== "string") return false;

    return true;
  }

  // =========================
  // Normalization Layer (FINAL)
  // =========================
  static from(event) {
    if (!event || typeof event !== "object") return null;

    const source = event.data ?? event;

    return new RuntimeEventContract({
      type: "runtime.event",

      name:
        source.name ?? event.name,

      payload:
        source.payload ??
        source.data ??
        event.payload ??
        {},

      timestamp:
        event.meta?.timestamp ??
        event.timestamp ??
        Date.now()
    });
  }
}
