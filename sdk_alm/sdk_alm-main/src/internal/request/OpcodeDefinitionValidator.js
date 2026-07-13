// src/internal/request/OpcodeDefinitionValidator.js

export class OpcodeDefinitionValidator {
  static validate(definition) {
    if (!definition?.name) {
      throw new Error("Opcode name is required");
    }

    if (!Array.isArray(definition.transports)) {
      throw new Error("transports must be an array");
    }
  }
}
