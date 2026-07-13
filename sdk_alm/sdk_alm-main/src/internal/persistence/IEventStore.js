export class IEventStore {
  append(event) {
    throw new Error("Not implemented");
  }

  getAll() {
    throw new Error("Not implemented");
  }

  getByType(type) {
    throw new Error("Not implemented");
  }

  clear() {
    throw new Error("Not implemented");
  }
}
