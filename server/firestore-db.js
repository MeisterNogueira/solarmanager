const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./firestore/key/solarmanager-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const userDb = require('./models/user-db.js');
const boardDb = require('./models/board-db.js');

const USER_COLLECTION = "users";
const BOARD_COLLECTION = "boards";

module.exports = function() {
  const db = getFirestore();

  return {
    user: user,
    board: board
  }

  function user() {
    return userDb(db.collection(USER_COLLECTION));
  }

  function board() {
    return boardDb(db, db.collection(BOARD_COLLECTION));
  }
}