const pool = require("../db");

async function createRequest(userId, message) {
  return pool.query(
    "INSERT INTO requests (user_id, message) VALUES ($1, $2)",
    [userId, message]
  );
}

async function getLastRequests(limit = 5) {
  const res = await pool.query(
    "SELECT * FROM requests ORDER BY id DESC LIMIT $1",
    [limit]
  );
  return res.rows;
}

module.exports = {
  createRequest,
  getLastRequests,
};