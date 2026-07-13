// src/internal/request/middleware/xx19SignatureMiddleware.js

export function xx19SignatureMiddleware(ctx, next) {
  const request = ctx.request;

  const payload = {
    opcode: request.opcode,
    requestId: request.requestId,
    deviceId: request.deviceId,
    payload: request.payload,
    timestamp: Date.now()
  };

  // deterministic signature (placeholder)
  ctx.signature = generateSignature(payload);

  request.metadata = {
    ...request.metadata,
    signature: ctx.signature
  };

  return next();
}

// placeholder signature engine (Xx19 concept)
function generateSignature(data) {
  let hash = 0;
  const str = JSON.stringify(data);

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return `xx19:${Math.abs(hash)}`;
}
