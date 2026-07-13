export class BaseEventStore {
  append(event) {
    throw new Error(
      "append() not implemented"
    );
  }

  getAll() {
    throw new Error(
      "getAll() not implemented"
    );
  }

  getByType(type) {
    throw new Error(
      "getByType() not implemented"
    );
  }

  clear() {
    throw new Error(
      "clear() not implemented"
    );
  }
}
