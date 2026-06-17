const { setState, getState, clearState } = require("../services/stateService");
const { createRequest } = require("../services/requestService");
const { ADMIN_ID } = require("../config");

const userData = new Map();

module.exports = (bot) => {
  bot.on("message", async (msg) => {
    const userId = msg.from.id;
    const text = msg.text;

    try {
      // 🚀 старт анкеты
      if (text === "📩 Оставить заявку") {
        setState(userId, "WAIT_NAME");
        userData.set(userId, {});
        return bot.sendMessage(msg.chat.id, "Как вас зовут?");
      }

      // 📞 контакты
      if (text === "📞 Контакты") {
        return bot.sendMessage(msg.chat.id, "Связь: @wakemeuparalyzed");
      }

      const state = getState(userId);

      // 👤 имя
      if (state === "WAIT_NAME") {
        userData.get(userId).name = text;
        setState(userId, "WAIT_PHONE");
        return bot.sendMessage(msg.chat.id, "Ваш телефон?");
      }

      // 📱 телефон
      if (state === "WAIT_PHONE") {
        userData.get(userId).phone = text;
        setState(userId, "WAIT_MESSAGE");
        return bot.sendMessage(msg.chat.id, "Комментарий?");
      }

      // 💬 финал
      if (state === "WAIT_MESSAGE") {
        const data = userData.get(userId);

        await createRequest({
          userId,
          name: data.name,
          phone: data.phone,
          message: text,
        });

        // очистка
        clearState(userId);
        userData.delete(userId);

        bot.sendMessage(msg.chat.id, "Заявка отправлена ✅");

        bot.sendMessage(
          ADMIN_ID,
          `🔥 Новая заявка:
👤 Имя: ${data.name}
📱 Телефон: ${data.phone}
💬 Сообщение: ${text}`
        );
      }

    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка 😢");
    }
  });
};