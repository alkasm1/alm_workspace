export class ReplayEngine {
  constructor({ repository, handler }) {
    this.repository = repository;
    this.handler = handler; // ALMClient
  }

  async replay({ type = null } = {}) {
    const events = type
      ? this.repository.byType(type)
      : this.repository.all();

    for (const record of events) {
      await this.handler._routeEvent(
        record.event,
        {
          replay: true
        }
      );
    }

    return {
      replayed: events.length
    };
  }
}
