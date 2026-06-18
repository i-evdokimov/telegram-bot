const { getRequests, getStats } = require("../services/requestService");
const { ADMIN_ID } = require("../config");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

module.exports = (bot) => {
  // 📥 Excel с заявками
  bot.onText(/\/requests/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, "нет доступа");
    }

    try {
      const requests = await getRequests();

      if (!requests.length) {
        return bot.sendMessage(msg.chat.id, "Заявок нет");
      }

      // создаем Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Заявки");

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Имя", key: "name", width: 20 },
        { header: "Телефон", key: "phone", width: 20 },
        { header: "Сообщение", key: "message", width: 30 },
        { header: "Telegram", key: "username", width: 20 },
        { header: "Дата", key: "date", width: 25 },
      ];

      requests.forEach((r) => {
        sheet.addRow({
          id: r.id,
          name: r.name,
          phone: r.phone,
          message: r.message,
          username: r.username ? `@${r.username}` : "нет",
          date: new Date(r.created_at).toLocaleString("ru-RU"),
        });
      });

      const filePath = path.join(__dirname, "../requests.xlsx");

      await workbook.xlsx.writeFile(filePath);

      // отправляем файл
      await bot.sendDocument(msg.chat.id, filePath);

      // удаляем после отправки
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка формирования файла");
    }
  });

  // 📊 статистика
  bot.onText(/\/stats/, async (msg) => {
    if (msg.from.id !== ADMIN_ID) {
      return bot.sendMessage(msg.chat.id, "нет доступа");
    }

    try {
      const stats = await getStats();

      bot.sendMessage(
        msg.chat.id,
        `Статистика\n\nВсего заявок: ${stats.total}`
      );
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "Ошибка статистики");
    }
  });
};