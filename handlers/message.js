bot.on("message", async (msg) => {
  try {
    const text = msg.text;

    // 👉 кнопка "Контакты"
    if (text === "📞 Контакты") {
      return bot.sendMessage(
        msg.chat.id,
        "Связь с менеджером: @your_username"
      );
    }

    // 👉 кнопка "Оставить заявку"
    if (text === "📩 Оставить заявку") {
      return bot.sendMessage(
        msg.chat.id,
        "Напишите вашу заявку текстом 👇"
      );
    }

    const result = await handleUserMessage(msg);

    if (!result) return;

    if (result.error) {
      return bot.sendMessage(msg.chat.id, "Не спамь 😅");
    }

    bot.sendMessage(msg.chat.id, "Заявка отправлена ✅");

    bot.sendMessage(
      process.env.ADMIN_ID,
      `🔥 Новая заявка:\n${result.text}`
    );

  } catch (e) {
    console.error(e);
    bot.sendMessage(msg.chat.id, "Ошибка 😢");
  }
});