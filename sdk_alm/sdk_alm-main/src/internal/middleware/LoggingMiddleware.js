export function LoggingMiddleware() {
  return async (ctx, next) => {
    const start = Date.now();

    await next();

    const duration = Date.now() - start;

    console.log(
      `[${ctx.request.opcode}] ${duration}ms`
    );
  };
}
