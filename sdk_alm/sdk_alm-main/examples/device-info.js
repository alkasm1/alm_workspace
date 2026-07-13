import { ALMClient } from "../src/index.js";

const alm = new ALMClient({
  endpoint: "ws://localhost:8080"
});

await alm.connect();

const device =
  alm.devices.get("router-1");

const info =
  await device.info();

console.log(info);

await alm.disconnect();
