export class RuntimeGuard {
  constructor(config = {}) {
    this.config = config;
  }

  async initialize() {
    return true;
  }

  async shutdown() {
    return true;
  }
}
