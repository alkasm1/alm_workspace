import { ALMClient } from "./client/ALMClient.js";

export class ALM {
  constructor(config) {
    this._client = new ALMClient(config);
  }

  // =========================
  // Lifecycle
  // =========================
  connect() {
    return this._client.connect();
  }

  disconnect() {
    return this._client.disconnect();
  }

  // =========================
  // System API
  // =========================
  system = {
    info: (deviceId) =>
      this._client.system.info(deviceId),

    exec: (deviceId, command) =>
      this._client.system.exec(deviceId, command)
  };

  // =========================
  // Tasks API
  // =========================
  tasks = {
    run: (deviceId, taskName, payload) =>
      this._client.tasks.run(deviceId, taskName, payload)
  };

  // =========================
  // Devices API
  // =========================
  devices = {
    get: (id) =>
      this._client.devices.get(id),

    list: () =>
      this._client.devices.list()
  };

  // =========================
  // Events API
  // =========================
  on(event, fn) {
    this._client.on(event, fn);
  }

  off(event, fn) {
    this._client.off(event, fn);
  }

  once(event, fn) {
    this._client.once(event, fn);
  }

  // =========================
  // Persistence
  // =========================
  getEvents() {
    return this._client.getEvents();
  }

  getStats() {
    return this._client.getEventStats();
  }

  replay(filter) {
    return this._client.replay(filter);
  }
}
