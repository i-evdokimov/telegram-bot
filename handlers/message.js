const { handleUserMessage } = require("../controllers/requestController");
const { ADMIN_ID } = require("../config");

module.exports = (bot) => {
  bot.on("message", async (msg) => {
    try {
      const text = msg.text;

      // кнопки
      if (text === "📞 Контакты") {
        return bot.sendMessage(
          msg.chat.id,
          "Связь: @your_username"
        );
      }

      if (text === "📩 Оставить заявку") {
        return bot.sendMessage(
          msg.chat.id,
          "Напишите вашу заявку 👇"
        );
      }

      const result = await handleUserMessage(msg);

      if (!result) return;

      if (result.error) {
        return bot.sendMessage(msg.chat.id, "Не спамь 😅");
      }

      bot.sendMessage(msg.chat.id, "Заявка отправлена ✅");

      bot.sendMessage(
        ADMIN_ID,
        `🔥 Новая заявка:\n${result.text}`
      );

    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка 😢");
    }
  });
};