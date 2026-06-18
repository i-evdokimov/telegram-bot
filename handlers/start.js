module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, {
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