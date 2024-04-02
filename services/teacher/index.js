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

exports.getClassrooms = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  return db.collection('classroom').get().then((snapshot) => {
    const classrooms = [];
    snapshot.forEach((doc) => {
      classrooms.push(doc.data());
    });
    console.log(classrooms)
    return classrooms;
  });

});

function addUserToClassDb(classCode, teacherName, uid) {
  return db.collection('classroom').doc(classCode.toString()).set({
    teacherName: teacherName,
    uid: uid
  })
}

