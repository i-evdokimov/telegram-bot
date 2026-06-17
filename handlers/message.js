const { setState, getState, clearState } = require("../services/stateService");
const { createRequest } = require("../services/requestService");
const { ADMIN_ID } = require("../config");
const { mainKeyboard } = require("../keyboards/main");

const userData = new Map();

module.exports = (bot) => {
  bot.on("message", async (msg) => {
    const userId = msg.from.id;
    const text = msg.text;

    try {
      // 🚀 СТАРТ
      if (text === "/start") {
        clearState(userId);
        userData.delete(userId);

        return bot.sendMessage(
          msg.chat.id,
          "Добро пожаловать 👋\n\nВыберите действие:",
          mainKeyboard
        );
      }

      // 📊 АДМИНКА (кнопка)
      if (text === "📊 Админка" && userId === ADMIN_ID) {
        return bot.sendMessage(
          msg.chat.id,
          "📊 Админка\n\nКоманды:\n/requests\n/stats"
        );
      }

      // ❌ ОТМЕНА
      if (text === "❌ Отмена") {
        clearState(userId);
        userData.delete(userId);

        return bot.sendMessage(
          msg.chat.id,
          "Заявка отменена ❌",
          mainKeyboard
        );
      }

      // 📩 НАЧАЛО АНКЕТЫ
      if (text === "📩 Оставить заявку") {
        setState(userId, "WAIT_NAME");
        userData.set(userId, {});

        return bot.sendMessage(
          msg.chat.id,
          "👋 Отлично, давайте оформим заявку\n\nКак вас зовут?"
        );
      }

      // 📞 КОНТАКТЫ
      if (text === "📞 Контакты") {
        return bot.sendMessage(
          msg.chat.id,
          "Связь: @wakemeuparalyzed",
          mainKeyboard
        );
      }

      const state = getState(userId);

      // 👤 ИМЯ
      if (state === "WAIT_NAME") {
        userData.get(userId).name = text;
        setState(userId, "WAIT_PHONE");

        return bot.sendMessage(
          msg.chat.id,
          "📱 Укажите ваш телефон\n\n(пример: +79991234567)"
        );
      }

      // 📱 ТЕЛЕФОН
      if (state === "WAIT_PHONE") {
        if (!/^\+7\d{10}$/.test(text)) {
          return bot.sendMessage(
            msg.chat.id,
            "Введите телефон в формате +79991234567 🙏"
          );
        }

        userData.get(userId).phone = text;
        setState(userId, "WAIT_MESSAGE");

        return bot.sendMessage(
          msg.chat.id,
          "💬 Напишите комментарий или задачу"
        );
      }

      // 💬 ФИНАЛ
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

        // ✅ пользователю
        await bot.sendMessage(
          msg.chat.id,
          "✅ Заявка принята!\nМенеджер скоро свяжется 🚀",
          mainKeyboard
        );

        // 🔔 админу
        const username = msg.from.username
          ? `@${msg.from.username}`
          : "нет";

        const now = new Date().toLocaleString("ru-RU");

        await bot.sendMessage(
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