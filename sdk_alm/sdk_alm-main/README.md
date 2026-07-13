ALM SDK

Event-driven JavaScript SDK for device management, task orchestration, and real-time communication over WebSocket.

---

Features

- Real-time WebSocket transport
- Event-driven architecture
- Device management
- Task lifecycle tracking
- Automatic reconnection
- Heartbeat monitoring
- Clean public API
- Lightweight SDK distribution

---

Installation

npm install sdk_alm

---

Basic Usage

import { ALMClient } from "sdk_alm";

const client = new ALMClient({
  endpoint: "ws://localhost:8080"
});

await client.connect();

console.log("Connected");

const info =
  await client.system.info(
    "router-1"
  );

console.log(info);

await client.disconnect();

Example response:

{
  hostname: "router-1",
  version: "0.1.0",
  platform: "Alm Runtime"
}

---

Execute Commands

const result =
  await client.system.exec(
    "router-1",
    "uname -a"
  );

console.log(result);

---

Run Tasks

const task =
  await client.tasks.run(
    "router-1",
    "backup"
  );

console.log(task);

---

Device Access

const device =
  client.devices.get(
    "router-1"
  );

const info =
  await device.info();

console.log(info);

---

Listen For Events

client.on(
  "device.event",
  (event) => {
    console.log(event);
  }
);

client.on(
  "task.event",
  (event) => {
    console.log(event);
  }
);

---

Transport Events

client.on(
  "transport.connected",
  () => console.log("Connected")
);

client.on(
  "transport.disconnected",
  () => console.log("Disconnected")
);

client.on(
  "transport.reconnecting",
  ({ attempt }) =>
    console.log(
      "Reconnect:",
      attempt
    )
);

---

Event Store

console.log(
  client.getEventStats()
);

console.log(
  client.getEvents()
);

Example:

{
  total: 70,
  byType: {
    "task.event": 22,
    "device.event": 48
  }
}

---

Examples

node examples/connect.js

node examples/device-info.js

node examples/system-exec.js

node examples/tasks.js

node examples/events.js

node examples/basic.js

---

Requirements

- Node.js 18+
- WebSocket-compatible ALM Runtime

---

License

UNLICENSED
