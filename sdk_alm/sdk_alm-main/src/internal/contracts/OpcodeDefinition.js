// src/internal/contracts/OpcodeDefinition.js

export class OpcodeDefinition {
  constructor({
    name,
    version = 1,
    transports = ["ws"],
    signature = null,
    permissions = []
  }) {
    this.name = name;
    this.version = version;
    this.transports = transports;
    this.signature = signature;
    this.permissions = permissions;
  }
}
