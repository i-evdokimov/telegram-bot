const { getRequests, getStats } = require("../services/requestService");
const { ADMIN_ID } = require("../config");

module.exports = (bot) => {
  // 📋 список заявок
  bot.onText(/\/requests/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) return;

    try {
      const requests = await getRequests();

      if (!requests.length) {
        return bot.sendMessage(msg.chat.id, "Заявок пока нет");
      }

      for (const r of requests) {
        const username = r.username ? `@${r.username}` : "нет";

        await bot.sendMessage(
          msg.chat.id,
          `📥 <b>Заявка #${r.id}</b>

👤 ${r.name}
📱 ${r.phone}
💬 ${r.message}
🔗 ${username}
🕒 ${new Date(r.created_at).toLocaleString("ru-RU")}`,
          { parse_mode: "HTML" }
        );
      }
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка загрузки заявок 😢");
    }
  });

  // 📊 статистика
  bot.onText(/\/stats/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) return;

    try {
      const stats = await getStats();

      bot.sendMessage(
        msg.chat.id,
        `📊 <b>Статистика</b>

Всего заявок: ${stats.total}`,
        { parse_mode: "HTML" }
      );
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка статистики 😢");
    }
  });
};