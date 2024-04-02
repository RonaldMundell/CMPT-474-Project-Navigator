const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addClassroom = functions.https.onCall((data, context) => {
  const classCode = data.classCode;
  const teacherName = data.teacherName
  if (data.length === 0) {
    throw new functions.https.HttpsError("Invalid argument", 'the function must be called with ' +
      'one arguments "text" containing the message text to add')
  }

  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  const uid = context.auth.uid || null;
  return addUserToClassDb(classCode, teacherName, uid);

});

function addUserToClassDb(classCode, teacherName, uid) {
  return db.collection('classroom').doc(classCode.toString()).set({
    teacherName: teacherName,
    uid: uid
  })
}
