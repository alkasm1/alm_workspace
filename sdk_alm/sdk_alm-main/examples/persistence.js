import { ALMClient } from "../src/index.js";

const alm = new ALMClient({
  endpoint: "ws://localhost:8080"
});

console.log(
  "Events:",
  alm.getEventCount()
);

console.log(
  "Stats:",
  alm.getEventStats()
);

console.log(
  alm.getEvents()
);
