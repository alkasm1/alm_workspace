export class Runtime {
  constructor(client) {
    this.client = client;
  }

  connect() {
    return this.client.connect();
  }

  disconnect() {
    return this.client.disconnect();
  }

  get system() {
    return this.client.system;
  }

  get tasks() {
    return this.client.tasks;
  }

  get devices() {
    return this.client.devices;
  }

  on(...args) {
    return this.client.on(...args);
  }

  off(...args) {
    return this.client.off(...args);
  }

  once(...args) {
    return this.client.once(...args);
  }

  getEvents() {
    return this.client.getEvents();
  }

  getEventStats() {
    return this.client.getEventStats();
  }

  replay(filter) {
    return this.client.replay(filter);
  }
}
