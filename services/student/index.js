const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.addStudent = functions.https.onCall((data, context) => {
  const studentName = data.studentName;
  const classroomCode = data.classroomCode;
  if (data.length === 0) {
    throw new functions.https.HttpsError("Invalid argument", 'the function must be called with ' +
      'one arguments "text" containing the message text to add')
  }

  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  const uid = context.auth.uid || null;
  return addUserToClassDb(studentName, classroomCode, uid);

});

function addUserToClassDb(studentName, classroomCode, uid) {
  return db.collection('students').doc(studentName.toString()).set({
    studentName: studentName,
    classroomCode: classroomCode,
    uid: uid
  })
}

