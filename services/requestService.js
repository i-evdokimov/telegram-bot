const pool = require("../db");

async function createRequest({
  userId,
  name,
  phone,
  message,
  username,
}) {
  return pool.query(
    `INSERT INTO requests (user_id, name, phone, message, username)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, name, phone, message, username]
  );
}

module.exports = { createRequest };