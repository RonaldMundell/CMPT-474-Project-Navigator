
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addUserAfterCreation = functions.auth.user().onCreate((user) => {
    return addUserToDb(user.email, user.uid);
});

async function addUserToDb(email, uid) {
    await db.collection('users').doc(uid).set({
        email: email
    });
}