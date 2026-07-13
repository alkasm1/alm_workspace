export class EventRepository {
  constructor(store) {
    this.store = store;
  }

  save(event) {
    return this.store.append(event);
  }

  all() {
    return this.store.getAll();
  }

  byType(type) {
    return this.store.getByType(type);
  }

  count() {
    return this.all().length;
  }

  clear() {
    return this.store.clear();
  }

  stats() {
    const events = this.all();

    return {
      total: events.length,

      byType: events.reduce(
        (acc, record) => {
          const type =
            record.event?.type ??
            "unknown";

          acc[type] =
            (acc[type] ?? 0) + 1;

          return acc;
        },
        {}
      )
    };
  }
}
