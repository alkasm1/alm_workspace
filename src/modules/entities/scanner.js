const { createRuntime } = require('../../core/runtime.js');

async function scanEntities() {
    const alm = createRuntime();

    if (!alm.registry) {
        console.log("⚠️ Registry غير موجود داخل SDK.");
        return;
    }

    const list = alm.registry.list();
    console.log("Detected Entities:");
    console.log(list);
}

module.exports = { scanEntities };
