import { ALMClient } from "../src/index.js";

async function main() {
  const alm = new ALMClient({
    endpoint: "ws://localhost:8080"
  });

  try {
    await alm.connect();

    const result =
      await alm.system.exec(
        "router-1",
        "uname -a"
      );

    console.log(result);
  } finally {
    await alm.disconnect();
  }
}

main().catch(console.error);
