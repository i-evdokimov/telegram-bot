const userStates = new Map();

function setState(userId, state) {
  userStates.set(userId, state);
}

function getState(userId) {
  return userStates.get(userId);
}

function clearState(userId) {
  userStates.delete(userId);
}

module.exports = {
  setState,
  getState,
  clearState,
};