
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addUserAfterCreation = functions.auth.user().onCreate(async (user) => {
  await addUserToDb(user.email, user.uid);
});

exports.setRole = functions.https.onCall(async (data, context) => {
  console.log(data);
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to change role');
  }
  await setRoleInDb(data.uid, data.role);
})

async function setRoleInDb(uid, role) {
  await db.collection('users').doc(uid.toString()).update({
    role: role
  });
}

async function addUserToDb(email, uid) {
  await db.collection('users').doc(uid.toString()).set({
    email: email
  });
}
