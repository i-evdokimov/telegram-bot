const bot = require("./bot");

require("./handlers/start")(bot);
require("./handlers/message")(bot);

console.log("🤖 Bot started...");