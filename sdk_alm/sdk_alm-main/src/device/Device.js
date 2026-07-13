export class Device {
  constructor(client, deviceId) {
    this.client = client;
    this.deviceId = deviceId;
  }

  async info() {
    return this.client.system.info(
      this.deviceId
    );
  }

  async exec(command) {
    return this.client.system.exec(
      this.deviceId,
      command
    );
  }

  async runTask(task) {
    return this.client.tasks.run(
      this.deviceId,
      task
    );
  }
}
