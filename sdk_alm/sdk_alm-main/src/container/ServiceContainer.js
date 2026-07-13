export class ServiceContainer {
  constructor() {
    this.services = new Map();
  }

  register(name, service) {
    if (this.services.has(name)) {
      throw new Error(
        `Service already registered: ${name}`
      );
    }

    this.services.set(name, service);
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(
        `Unknown service: ${name}`
      );
    }

    return this.services.get(name);
  }

  has(name) {
    return this.services.has(name);
  }

  remove(name) {
    this.services.delete(name);
  }

  clear() {
    this.services.clear();
  }

  keys() {
    return [...this.services.keys()];
  }
}
