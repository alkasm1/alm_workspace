// examples/basic.js

import { ALMClient } from "../src/index.js";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    // =========================
    // Client Init
    // =========================
    const alm = new ALMClient({
      endpoint: "ws://localhost:8080"
    });

    // =========================
    // Middleware (اختياري فقط)
    // =========================
    alm.use?.(async (ctx, next) => {
      console.log(`\n[Middleware] => ${ctx.request.opcode}`);
      await next();
      console.log(`[Middleware Done] => ${ctx.request.opcode}`);
    });

    // =========================
    // Events (Core)
    // =========================
    alm.on("device.event", (event) => {
      console.log("\n[DEVICE EVENT]");
      console.dir(event, { depth: null });
    });

    alm.on("task.event", (event) => {
      console.log("\n[TASK EVENT]");
      console.dir(event, { depth: null });
    });

    // =========================
    // Transport Events
    // =========================
    alm.on("transport.connected", () => {
      console.log("\n[CONNECTED]");
    });

    alm.on("transport.disconnected", () => {
      console.log("\n[DISCONNECTED]");
    });

    alm.on("transport.reconnecting", ({ attempt }) => {
      console.log(`\n[RECONNECTING] attempt=${attempt}`);
    });

    alm.on("transport.error", (error) => {
      console.log("\n[TRANSPORT ERROR]");
      console.error(error);
    });

    // =========================
    // Registry Debug
    // =========================
    console.log("Registered opcodes:");
    console.dir(alm.registry.list?.() ?? [], { depth: null });

    // =========================
    // Connect
    // =========================
    await alm.connect();

    console.log("\nConnected");

    // =========================
    // Device Access Layer
    // =========================
    const router = alm.devices.get("router-1");

    if (!router) {
      throw new Error("Device router-1 not found");
    }

    console.log("\nDevice:", router.deviceId);

    // =========================
    // Device API
    // =========================
    console.log("\n=== device.info ===");

    const info = await router.info();
    console.dir(info, { depth: null });

    console.log("\n=== device.exec ===");

    const execResult = await router.exec("uname -a");
    console.dir(execResult, { depth: null });

    // =========================
    // Task API
    // =========================
    console.log("\n=== task.run ===");

    const taskResult = await alm.tasks.run(
      "router-1",
      "backup-config"
    );

    console.dir(taskResult, { depth: null });

    // allow async events to arrive
    await sleep(150);

    // =========================
    // Cache Inspection (Task)
    // =========================
    console.log("\n=== Task Cache ===");

    console.log(
      "Has task:",
      alm.taskManager.has(taskResult.result.taskId)
    );

    console.log("Known tasks:", alm.taskManager.ids());

    console.dir(
      alm.taskManager.list().map((t) => t.toJSON()),
      { depth: null }
    );

    // =========================
    // Cache Inspection (Device)
    // =========================
    console.log("\n=== Device Cache ===");

    console.log("Has router:", alm.devices.has("router-1"));

    console.log(
      "Known devices:",
      alm.devices.list().map((d) => d.deviceId)
    );

    // =========================
    // Wait for async events
    // =========================
    console.log("\nWaiting for events (10s)...");

    await sleep(10000);

    // =========================
    // Event Store
    // =========================
    console.log("\n=== Event Store ===");

    console.log("Event Count:", alm.getEventCount());
    console.log("Stats:", alm.getEventStats());
    console.log("Events:", alm.getEvents());

    // =========================
    // Disconnect
    // =========================
    await alm.disconnect();

    console.log("\nDisconnected");
  } catch (error) {
    console.error("Example failed:");
    console.error(error);
  }
}

main();
