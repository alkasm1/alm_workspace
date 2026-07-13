export class DeviceEventContract {
  constructor({
    type = "device.event",
    deviceId,
    payload = {},
    timestamp = Date.now()
  }) {
    this.type = type;
    this.deviceId = deviceId;
    this.payload = payload;
    this.timestamp = timestamp;
  }

  // =========================
  // Validation Layer
  // =========================
  static validate(event) {
    if (!event || typeof event !== "object") return false;

    if (event.type !== "device.event") return false;

    if (typeof event.deviceId !== "string") return false;

    return true;
  }

  // =========================
  // Normalization Layer (FINAL)
  // =========================
  static from(event) {
    if (!event || typeof event !== "object") return null;

    const source = event.data ?? event;

    return new DeviceEventContract({
      type: "device.event",

      deviceId:
        source.deviceId ?? event.deviceId,

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
