const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore("students");

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

exports.getStudents = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  return db.collection('students').get().then((snapshot) => {
    const students = [];
    snapshot.forEach((doc) => {
      students.push(doc.data());
    });
    console.log(students)
    return students;
  });

});

function addUserToClassDb(studentName, classroomCode, uid) {
  return db.collection('students').doc(studentName.toString()).set({
    studentName: studentName,
    classroomCode: classroomCode,
    uid: uid
  })
}

