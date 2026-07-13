// src/internal/request/PendingRequests.js

export class PendingRequests {
  constructor() {
    this.map = new Map();
  }

  add(
    requestId,
    {
      resolve,
      reject,
      timeoutId = null
    }
  ) {
    this.map.set(requestId, {
      resolve,
      reject,
      timeoutId,
      startedAt: Date.now()
    });
  }

  has(requestId) {
    return this.map.has(requestId);
  }

  get(requestId) {
    return (
      this.map.get(requestId) ??
      null
    );
  }

  resolve(requestId, response) {
    const entry =
      this.map.get(requestId);

    if (!entry) {
      return false;
    }

    if (entry.timeoutId) {
      clearTimeout(
        entry.timeoutId
      );
    }

    this.map.delete(requestId);

    entry.resolve(response);

    return true;
  }

  reject(requestId, error) {
    const entry =
      this.map.get(requestId);

    if (!entry) {
      return false;
    }

    if (entry.timeoutId) {
      clearTimeout(
        entry.timeoutId
      );
    }

    this.map.delete(requestId);

    entry.reject(error);

    return true;
  }

  cancel(
    requestId,
    error = new Error(
      "Request cancelled"
    )
  ) {
    return this.reject(
      requestId,
      error
    );
  }

  remove(requestId) {
    const entry =
      this.map.get(requestId);

    if (!entry) {
      return false;
    }

    if (entry.timeoutId) {
      clearTimeout(
        entry.timeoutId
      );
    }

    this.map.delete(requestId);

    return true;
  }

  clear(
    error = new Error(
      "Pending requests cleared"
    )
  ) {
    for (const [requestId, entry] of [...this.map.entries()]) {
      if (entry.timeoutId) {
        clearTimeout(
          entry.timeoutId
        );
      }

      entry.reject(error);

      this.map.delete(
        requestId
      );
    }
  }

  entries() {
    return [
      ...this.map.entries()
    ];
  }

  ids() {
    return [
      ...this.map.keys()
    ];
  }

  stats() {
    return {
      count: this.map.size,
      requestIds: this.ids()
    };
  }

  oldest() {
  const entries = [...this.map.entries()];

  if (!entries.length) {
    return null;
  }

  entries.sort(
    (a, b) =>
      a[1].startedAt -
      b[1].startedAt
  );

  const [requestId, entry] =
    entries[0];

  return {
    requestId,
    age:
      Date.now() -
      entry.startedAt
  };
}
  get size() {
    return this.map.size;
  }
}
