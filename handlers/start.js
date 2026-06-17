module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Добро пожаловать 👋", {
      reply_markup: {
        keyboard: [
          ["📩 Оставить заявку"],
          ["📞 Контакты"],
        ],
        resize_keyboard: true,
      },
    });
  });
};