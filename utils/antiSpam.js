const lastMessageTime = new Map();

function isSpam(userId) {
  const now = Date.now();

  if (lastMessageTime.has(userId)) {
    const diff = now - lastMessageTime.get(userId);
    if (diff < 2000) return true;
  }

  lastMessageTime.set(userId, now);
  return false;
}

module.exports = { isSpam };