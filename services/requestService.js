const pool = require("../db");

async function createRequest({ userId, name, phone, message }) {
  return pool.query(
    `INSERT INTO requests (user_id, name, phone, message)
     VALUES ($1, $2, $3, $4)`,
    [userId, name, phone, message]
  );
}

module.exports = { createRequest };