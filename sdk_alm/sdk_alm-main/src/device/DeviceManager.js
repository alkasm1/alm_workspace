import { Device } from "./Device.js";

export class DeviceManager {
  constructor(client) {
    this.client = client;

    this.cache = new Map();
  }

  // =========================
  // Discovery
  // =========================
  async discover() {
    const response =
      await this.client.device.discover();

    const devices =
      response.result ?? [];

    return devices.map((info) => {
      const device =
        this.get(info.id);

      Object.assign(device, info, {
        lastSeen: Date.now()
      });

      return device;
    });
  }

  // =========================
  // Cache Access
  // =========================
  get(deviceId) {
    if (!this.cache.has(deviceId)) {
      this.cache.set(
        deviceId,
        new Device(
          this.client,
          deviceId
        )
      );
    }

    return this.cache.get(deviceId);
  }

  has(deviceId) {
    return this.cache.has(deviceId);
  }

  // =========================
  // Event Updates
  // =========================
  update(event) {
    if (!event) {
      return null;
    }

    // يدعم الشكلين:
    // event.deviceId
    // event.data.deviceId

    const deviceId =
      event.deviceId ??
      event.data?.deviceId;

    const status =
      event.status ??
      event.data?.status;

    if (!deviceId) {
      return null;
    }

    const device =
      this.get(deviceId);

    Object.assign(device, {
      status,

      timestamp:
        event.timestamp ??
        event.meta?.timestamp ??
        Date.now(),

      lastSeen: Date.now()
    });

    // حفظ آخر حدث بالكامل (مفيد للتشخيص)
    device.lastEvent = event;

    return device;
  }

  // =========================
  // Cache Management
  // =========================
  remove(deviceId) {
    this.cache.delete(deviceId);
  }

  clear() {
    this.cache.clear();
  }

  // =========================
  // Queries
  // =========================
  list() {
    return [...this.cache.values()];
  }

  ids() {
    return [...this.cache.keys()];
  }

  size() {
    return this.cache.size;
  }
}
