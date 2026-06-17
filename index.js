const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const db = require("./db");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    await db.query(
      `INSERT INTO users (telegram_id, username)
       VALUES ($1, $2)
       ON CONFLICT (telegram_id) DO NOTHING`,
      [chatId, username]
    );

    bot.sendMessage(chatId, "Привет! Ты добавлен в базу 🚀");
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Ошибка сервера 😢");
  }
});

// Простое сообщение
bot.on("message", (msg) => {
  if (msg.text !== "/start") {
    bot.sendMessage(msg.chat.id, "Я получил твоё сообщение 👍");
  }
});