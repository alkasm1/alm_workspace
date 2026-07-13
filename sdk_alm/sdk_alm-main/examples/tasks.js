import { ALMClient } from "../src/index.js";

async function main() {
  const client = new ALMClient({
    endpoint: "ws://localhost:8080"
  });

  // =========================
  // Event listeners
  // =========================
  client.on("task.event", (event) => {
    console.log("\n[TASK EVENT]");
    console.log(event);
  });

  client.on("transport.connected", () => {
    console.log("\n[CONNECTED]");
  });

  client.on("transport.disconnected", () => {
    console.log("\n[DISCONNECTED]");
  });

  // =========================
  // Connect
  // =========================
  await client.connect();

  // =========================
  // Ensure tasks module exists
  // =========================
  if (!client.tasks) {
    throw new Error("Tasks module not loaded");
  }

  // =========================
  // Run task
  // =========================
  const result = await client.tasks.run({
    command: "demo-task"
  });

  console.log("\nTask started:");
  console.log(result);

  // =========================
  // Task state snapshot (safe access)
  // =========================
  console.log("\nKnown tasks:");
  console.log(client.taskManager?.list?.() ?? []);

  // =========================
  // Delayed check
  // =========================
  setTimeout(async () => {
    console.log("\nUpdated tasks:");
    console.log(client.taskManager?.list?.() ?? []);

    await client.disconnect();
  }, 10000);
}

main().catch((err) => {
  console.error("[FATAL]", err);
});
