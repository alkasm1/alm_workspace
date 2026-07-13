// src/internal/request/OpcodeRegistry.js

import { OpcodeError } from "../errors/OpcodeError.js";
import { OpcodeDefinitionValidator } from "./OpcodeDefinitionValidator.js";

export class OpcodeRegistry {
  constructor() {
    this.definitions = new Map();
  }

  register(definition) {
    OpcodeDefinitionValidator.validate(definition);

    const name = definition.name;

    if (this.definitions.has(name)) {
      throw new OpcodeError(`Opcode already registered: ${name}`);
    }

    this.definitions.set(name, definition);
    return definition;
  }

  resolve(name) {
    return this.definitions.get(name) ?? null;
  }

  resolveOrThrow(name) {
    const def = this.resolve(name);
    if (!def) {
      throw new OpcodeError(`Opcode not found: ${name}`);
    }
    return def;
  }

  exists(name) {
    return this.definitions.has(name);
  }

  remove(name) {
    return this.definitions.delete(name);
  }

  list() {
    return [...this.definitions.values()];
  }

  supportsTransport(name, transport) {
    const def = this.resolve(name);
    if (!def) return false;
    return def.transports.includes(transport);
  }

  clear() {
    this.definitions.clear();
  }

  get count() {
    return this.definitions.size;
  }
}
