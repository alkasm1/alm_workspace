import { ALMClient } from "../src/index.js";

const client = new ALMClient({
 endpoint: "ws://localhost:8080"
});

client.on("device.event", (event) => {
console.log("\n[DEVICE EVENT]");
console.log(event);
});

client.on("task.event", (event) => {
console.log("\n[TASK EVENT]");
console.log(event);
});

client.on("runtime.event", (event) => {
console.log("\n[RUNTIME EVENT]");
console.log(event);
});

await client.connect();

console.log("Connected");
console.log("Listening for events...");

setTimeout(async () => {
await client.disconnect();
console.log("Disconnected");
}, 30000);
