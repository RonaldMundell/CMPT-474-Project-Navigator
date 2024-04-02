
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addUserAfterCreation = functions.https.onCall((data, context) => {
  console.log(data);
  if (!context.auth) {
    throw new https.HttpsError('failed-precondition', 'The function must be called while authenticated');
  }
  return addUserToDb(data.email, data.uid, data.role);
});

function addUserToDb(email, uid, role) {
  return db.collection('users').doc(uid.toString()).set({
    email: email,
    role: role
  });
}
