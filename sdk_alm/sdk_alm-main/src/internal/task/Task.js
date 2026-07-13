// src/internal/task/Task.js

export class Task {
  constructor(client, taskId) {
    this.client = client;

    this.taskId = taskId;

    this.status = "unknown";
    this.createdAt = Date.now();

    this.updatedAt = null;
    this.completedAt = null;
  }

  isRunning() {
    return this.status === "running";
  }

  isCompleted() {
    return this.status === "completed";
  }

  isFailed() {
    return this.status === "failed";
  }

  toJSON() {
    return {
      taskId: this.taskId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt
    };
  }
}
