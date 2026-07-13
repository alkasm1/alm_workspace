import { BaseModule } from "./BaseModule.js";
import { OpcodeDefinition } from "../contracts/OpcodeDefinition.js";

export class TasksModule extends BaseModule {
  static moduleName = "tasks";

  static registerOpcodes(registry) {
    registry.register(
      new OpcodeDefinition({
        name: "task.run"
      })
    );
  }

  // =========================
  // Remote Operations
  // =========================

  async run(deviceId, task) {
    return this.client.requestManager.send({
      opcode: "task.run",
      deviceId,
      payload: {
        task
      }
    });
  }

  // =========================
  // Task Cache API
  // =========================

  get(taskId) {
    return this.client.taskManager.get(taskId);
  }

  has(taskId) {
    return this.client.taskManager.has(taskId);
  }

  list() {
    return this.client.taskManager.list();
  }

  ids() {
    return this.client.taskManager.ids();
  }

  clear() {
    return this.client.taskManager.clear();
  }
}
