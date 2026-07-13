// src/internal/events/contracts/EventContractFactory.js

import { DeviceEventContract } from "./DeviceEventContract.js";
import { TaskEventContract } from "./TaskEventContract.js";
import { RuntimeEventContract } from "./RuntimeEventContract.js";

export class EventContractFactory {
  static registry = {
    "device.event": DeviceEventContract,
    "task.event": TaskEventContract,
    "runtime.event": RuntimeEventContract
  };

  static create(event) {
    if (!event || typeof event !== "object") {
      return null;
    }

    const Contract = this.registry[event.type];

    if (!Contract) {
      return null;
    }

    return Contract.from(event);
  }

  // =========================
  // Optional: extensibility hook
  // =========================
  static register(type, ContractClass) {
    this.registry[type] = ContractClass;
  }
}
