export class EventPipeline {
  constructor() {
    this.steps = [];
  }

  use(handler) {
    this.steps.push(handler);
  }

  async process(event) {
    if (!event || typeof event !== "object") {
      return null;
    }

    let current = event;

    for (const step of this.steps) {
      try {
        current = await step(current);

        // allow step to filter event
        if (!current) {
          return null;
        }
      } catch (error) {
        // لا نكسر الـ pipeline بسبب خطوة واحدة
        console.error("[EventPipeline] step error:", error);
        return null;
      }
    }

    return current;
  }
}
