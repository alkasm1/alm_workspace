// src/internal/task/TaskManager.js

import { Task } from "./Task.js";

export class TaskManager {
  constructor(client) {
    this.client = client;
    this.cache = new Map();
  }

  get(taskId) {
    if (!this.cache.has(taskId)) {
      this.cache.set(
        taskId,
        new Task(this.client, taskId)
      );
    }

    return this.cache.get(taskId);
  }

  has(taskId) {
    return this.cache.has(taskId);
  }

  update(event) {
    if (!event) return null;

    // =========================
    // Support BOTH raw + normalized
    // =========================
    const taskId =
      event.taskId ??
      event.data?.taskId;

    const status =
      event.status ??
      event.data?.status;

    if (!taskId) return null;

    const task = this.get(taskId);

    // =========================
    // State sync
    // =========================
    task.status = status ?? task.status;
    task.updatedAt = event.timestamp ?? Date.now();

    // =========================
    // Completion tracking
    // =========================
    if (status === "completed") {
      task.completedAt = event.timestamp ?? Date.now();
    }

    // =========================
    // Optional extensibility
    // =========================
    if (event.error || event.data?.error) {
      task.error = event.error ?? event.data?.error;
    }

    return task;
  }

  remove(taskId) {
    this.cache.delete(taskId);
  }

  clear() {
    this.cache.clear();
  }

  list() {
    return [...this.cache.values()];
  }

  ids() {
    return [...this.cache.keys()];
  }
}
