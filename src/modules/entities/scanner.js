const { Runtime } = require('../../../sdk_alm/src/runtime/Runtime.js');

async function scanEntities() {
    const runtime = new Runtime();
    await runtime.start();

    const list = runtime.registry.list();
    console.log("Detected Entities:");
    console.log(list);
}

module.exports = { scanEntities };
