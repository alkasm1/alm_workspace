// src/internal/middleware/MiddlewareManager.js

export class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    if (typeof middleware !== "function") {
      throw new Error(
        "Middleware must be a function"
      );
    }

    this.middlewares.push(middleware);
  }

  async execute(context, finalHandler) {
    let index = -1;

    const dispatch = async (i) => {
      if (i <= index) {
        throw new Error(
          "next() called multiple times"
        );
      }

      index = i;

      const middleware = this.middlewares[i];

      if (!middleware) {
        return finalHandler();
      }

      return middleware(
        context,
        () => dispatch(i + 1)
      );
    };

    return dispatch(0);
  }
}
