const { createRequest } = require("../services/requestService");
const { isSpam } = require("../utils/antiSpam");

async function handleUserMessage(msg) {
  const userId = msg.from.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return null;

  if (isSpam(userId)) {
    return { error: "Спам detected" };
  }

  await createRequest(userId, text);

  return { text };
}

module.exports = {
  handleUserMessage,
};