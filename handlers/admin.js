const { getRequests, getStats } = require("../services/requestService");
const { ADMIN_ID } = require("../config");

module.exports = (bot) => {
  // 📋 список заявок
  bot.onText(/\/requests/, async (msg) => {
    // ❗ защита
    if (msg.from.id !== ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, "нет доступа");
    }

    try {
      const requests = await getRequests();

      if (!requests.length) {
        return bot.sendMessage(msg.chat.id, "Заявок нет");
      }

      for (const r of requests) {
        const username = r.username ? `@${r.username}` : "нет";

        await bot.sendMessage(
          msg.chat.id,
          `Заявка #${r.id}

Имя: ${r.name}
Телефон: ${r.phone}
Сообщение: ${r.message}
Telegram: ${username}
Время: ${new Date(r.created_at).toLocaleString("ru-RU")}`
        );
      }
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка загрузки");
    }
  });

  // 📊 статистика
  bot.onText(/\/stats/, async (msg) => {
    // ❗ защита
    if (msg.from.id !== ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, "нет доступа");
    }

    try {
      const stats = await getStats();

      return bot.sendMessage(
        msg.chat.id,
        `Статистика

Всего заявок: ${stats.total}`
      );
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка статистики");
    }
  });
};