// src/internal/request/middleware/xx18EncodingMiddleware.js

export function xx18EncodingMiddleware(ctx, next) {
  const request = ctx.request;

  // المرحلة الأولى: normalization + encoding preparation
  ctx._encoding = {
    originalOpcode: request.opcode,
    encodedOpcode: encodeOpcode(request.opcode),
    payloadSnapshot: structuredClone(request.payload)
  };

  request.opcode = ctx._encoding.encodedOpcode;

  return next();
}

// placeholder deterministic encoder (Xx18 concept)
function encodeOpcode(opcode) {
  return `xx18::${opcode}`;
}
