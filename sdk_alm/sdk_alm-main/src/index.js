// =========================
// Core SDK Entry (Recommended)
// =========================
export { ALM } from "./ALM.js";

// =========================
// Advanced / Low-level Client (optional)
// =========================
export { ALMClient } from "./client/ALMClient.js";

// =========================
// Error Layer (Public API)
// =========================
export { ALMError } from "./internal/errors/ALMError.js";
export { OpcodeError } from "./internal/errors/OpcodeError.js";
export { TimeoutError } from "./internal/errors/TimeoutError.js";
export { TransportError } from "./internal/errors/TransportError.js";
