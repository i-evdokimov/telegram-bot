const bot = require("./bot");

// handlers
require("./handlers/start")(bot);
require("./handlers/message")(bot);

console.log("🤖 Bot started...");