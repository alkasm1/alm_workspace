import { ALMError } from "./ALMError.js";

export class OpcodeError extends ALMError {
  constructor(
    code = "ALM_OPCODE_ERROR",
    message = "Opcode error",
    details = null
  ) {
    super(
      code,
      message,
      details
    );
  }
}
