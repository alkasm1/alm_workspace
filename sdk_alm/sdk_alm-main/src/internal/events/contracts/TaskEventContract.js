export class TaskEventContract {
  constructor({
    type = "task.event",
    taskId,
    status,
    payload = {},
    timestamp = Date.now()
  }) {
    this.type = type;
    this.taskId = taskId;
    this.status = status;
    this.payload = payload;
    this.timestamp = timestamp;
  }

  // =========================
  // Validation Layer
  // =========================
  static validate(event) {
    if (!event || typeof event !== "object") return false;

    if (event.type !== "task.event") return false;

    if (typeof event.taskId !== "string") return false;

    if (typeof event.status !== "string") return false;

    return true;
  }

  // =========================
  // Normalization Layer (FINAL)
  // =========================
  static from(event) {
    if (!event || typeof event !== "object") return null;

    const source = event.data ?? event;

    return new TaskEventContract({
      type: "task.event",

      taskId:
        source.taskId ?? event.taskId,

      status:
        source.status ?? event.status,

      payload:
        source.payload ??
        source.data ??
        event.payload ??
        {},

      timestamp:
        event.meta?.timestamp ??
        event.timestamp ??
        Date.now()
    });
  }
}
