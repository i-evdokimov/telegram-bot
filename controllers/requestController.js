const { createRequest } = require("../services/requestService");
const { isSpam } = require("../utils/antiSpam");

const IGNORED_TEXTS = [
  "📩 Оставить заявку",
  "📞 Контакты"
];

async function handleUserMessage(msg) {
  const userId = msg.from.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return null;

  // ❌ игнор кнопок
  if (IGNORED_TEXTS.includes(text)) return null;

  // 🚫 антиспам
  if (isSpam(userId)) {
    return { error: "spam" };
  }

  await createRequest(userId, text);

  return { text };
}

module.exports = {
  handleUserMessage,
};