const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./firestore/key/solarmanager-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const USER_COLLECTION = "users";
const BOARD_COLLECTION = "boards";

module.exports = function() {
  const db = getFirestore();

  return {
    createBoard: createBoard,
    getUserBoard: getUserBoard
  }

  async function createBoard(username, board) {
    const newBoardRef = await db.collection(BOARD_COLLECTION).add(board);
    updateUserBoard(username, newBoardRef.id);
  }

  async function updateUserBoard(username, boardId) {
    const newUserBoardRef = db.collection(USER_COLLECTION).doc(username);
    const res = await newUserBoardRef.set({
      boardId: boardId
    }, { merge: true });
  }

  async function getUserBoard(username) {
    const userRef = db.collection(USER_COLLECTION).doc(username);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return;

    const userBoardRef = db.collection(BOARD_COLLECTION).doc(userDoc.data().boardId);
    const userBoardDoc = await userBoardRef.get();
    console.log(userBoardDoc.data());
  }
}