import { TaskEventContract } from "./contracts/TaskEventContract.js";
import { DeviceEventContract } from "./contracts/DeviceEventContract.js";
import { RuntimeEventContract } from "./contracts/RuntimeEventContract.js";

export class EventNormalizer {
  static normalize(event) {
    if (!event || typeof event !== "object") {
      return null;
    }

    const type = event.type || "unknown";

    // =========================
    // Contract validation
    // =========================
    switch (type) {
      case "task.event":
        if (!TaskEventContract.validate(event)) {
          return null;
        }
        break;

      case "device.event":
        if (!DeviceEventContract.validate(event)) {
          return null;
        }
        break;

      case "runtime.event":
        if (!RuntimeEventContract.validate(event)) {
          return null;
        }
        break;
    }

    const [name, action] = type.split(".");

    return {
      type,
      name: name || "unknown",
      action: action || "unknown",
      data: EventNormalizer.extractData(event),
      meta: {
        timestamp: event.timestamp ?? Date.now(),
        version: 1,
        source: "server"
      }
    };
  }

  static extractData(event) {
    const { type, timestamp, ...rest } = event;
    return rest;
  }
}
