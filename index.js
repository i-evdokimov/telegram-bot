const bot = require("./bot");

require("./handlers/start")(bot);
require("./handlers/message")(bot);
require("./handlers/admin")(bot);

console.log("🤖 Bot started...");