// src/internal/modules/SystemModule.js

import { BaseModule } from "./BaseModule.js";
import { OpcodeDefinition } from "../contracts/OpcodeDefinition.js";

export class SystemModule extends BaseModule {
  static moduleName = "system";

  static registerOpcodes(registry) {
    registry.register(
      new OpcodeDefinition({
        name: "system.info"
      })
    );

    registry.register(
      new OpcodeDefinition({
        name: "system.exec"
      })
    );
  }

  async info(deviceId) {
    return this.client.requestManager.send({
      opcode: "system.info",
      deviceId
    });
  }

  async exec(deviceId, command) {
    return this.client.requestManager.send({
      opcode: "system.exec",
      deviceId,
      payload: {
        command
      }
    });
  }
}
