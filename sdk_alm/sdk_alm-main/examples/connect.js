import { ALMClient } from "../src/index.js";

const alm = new ALMClient({
  endpoint: "ws://localhost:8080"
});

await alm.connect();

console.log("Connected");

await alm.disconnect();

console.log("Disconnected");
