// src/internal/modules/BaseModule.js

export class BaseModule {
  constructor(client) {
    this.client = client;
  }

  static get moduleName() {
    throw new Error("moduleName is required");
  }

  static registerOpcodes(registry) {
    // optional
  }
}
