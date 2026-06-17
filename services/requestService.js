const pool = require("../db");

// 📥 создать заявку (у тебя уже есть)
async function createRequest(data) {
  const query = `
    INSERT INTO requests (user_id, name, phone, message, username)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await pool.query(query, [
    data.userId,
    data.name,
    data.phone,
    data.message,
    data.username,
  ]);
}

// 📋 получить заявки
async function getRequests() {
  const res = await pool.query(`
    SELECT * FROM requests
    ORDER BY created_at DESC
    LIMIT 10
  `);

  return res.rows;
}

// 📊 статистика
async function getStats() {
  const res = await pool.query(`
    SELECT COUNT(*) FROM requests
  `);

  return {
    total: res.rows[0].count,
  };
}

module.exports = {
  createRequest,
  getRequests,
  getStats,
};