import { TaskEventContract } from "./contracts/TaskEventContract.js";
import { DeviceEventContract } from "./contracts/DeviceEventContract.js";
import { RuntimeEventContract } from "./contracts/RuntimeEventContract.js";

export class EventContractFactory {
  static create(event) {
    if (!event || typeof event !== "object") {
      return null;
    }

    const type = event.type || "unknown";

    switch (type) {
      case "task.event":
        return TaskEventContract.from(event);

      case "device.event":
        return DeviceEventContract.from(event);

      case "runtime.event":
        return RuntimeEventContract.from(event);

      default:
        return {
          type,
          name: "unknown",
          action: "unknown",
          data: event?.data ?? event,
          meta: {
            timestamp:
              event?.timestamp ??
              Date.now(),
            version: 1,
            source: "factory-fallback"
          }
        };
    }
  }

  // Optional helper for strict mode later
  static isKnownType(type) {
    return [
      "task.event",
      "device.event",
      "runtime.event"
    ].includes(type);
  }
}
