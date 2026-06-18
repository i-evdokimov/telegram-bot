const { ADMIN_ID } = require("../config");

const getMainKeyboard = (userId) => {
  const keyboard = [
    ["📩 Оставить заявку"],
    ["📞 Контакты"],
  ];

  if (userId === ADMIN_ID) {
    keyboard.push(["📊 Админка"]);
  }

  return {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
    },
  };
};

module.exports = { getMainKeyboard };