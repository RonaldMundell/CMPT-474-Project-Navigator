
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addUserAfterCreation = functions.https.onCall((data, context) => {
  return addUserToDb(data.email, data.uid);
});

exports.setRole = functions.https.onCall((data, context) => {
  console.log(data);
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to change role');
  }
  return setRoleInDb(data.uid, data.role);
})

function setRoleInDb(uid, role) {
  return db.collection('users').doc(uid.toString()).update({
    role: role
  });
}

function addUserToDb(email, uid) {
  return db.collection('users').doc(uid.toString()).set({
    email: email
  });
}
