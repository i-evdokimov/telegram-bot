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
      if (text === "❌ Отмена") {
        clearState(userId);
        userData.delete(userId);
        return bot.sendMessage(msg.chat.id, "Заявка отменена ❌");
      }

      // 👤 имя
      if (state === "WAIT_NAME") {
        userData.get(userId).name = text;
        setState(userId, "WAIT_PHONE");
        return bot.sendMessage(msg.chat.id, "Ваш телефон?");
      }

      // 📱 телефон
      if (state === "WAIT_PHONE") {
        if (!/^\+?\d{10,15}$/.test(text)) {
            return bot.sendMessage(msg.chat.id, "Введите корректный телефон 🙏");
        }

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
            username: msg.from.username,
        });

        clearState(userId);
        userData.delete(userId);

        // ✅ сообщение пользователю
        bot.sendMessage(
            msg.chat.id,
            "✅ Заявка принята!\nМенеджер скоро свяжется 🚀"
        );

        // 👇 ВОТ СЮДА ВСТАВЛЯЕТСЯ ТВОЙ КОД
        const username = msg.from.username
            ? `@${msg.from.username}`
            : "нет";

        const now = new Date().toLocaleString("ru-RU");

        bot.sendMessage(
            ADMIN_ID,
            `🔥 <b>Новая заявка</b>

        👤 <b>Имя:</b> ${data.name}
        📱 <b>Телефон:</b> ${data.phone}
        💬 <b>Сообщение:</b> ${text}

        🔗 <b>Telegram:</b> ${username}
        🕒 <b>Время:</b> ${now}
        🆔 <b>User ID:</b> ${userId}`,
            {
            parse_mode: "HTML",
            }
        );
      }

    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка 😢");
    }
  });
};