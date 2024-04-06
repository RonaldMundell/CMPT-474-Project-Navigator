const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore("teachers")

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

  return db.collection('classroom').where("uid", "==", data.user).get().then((snapshot) => {
    const classrooms = [];
    snapshot.forEach((doc) => {
      classrooms.push(doc.data());
    });
    return classrooms;
  });
});

exports.addAssignment = functions.https.onCall((data, context) => {
  if (data.length === 0) {
    throw new functions.https.HttpsError("Invalid argument", 'the function must be called with ' +
      'one arguments "text" containing the message text to add')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }
  return addAssignmentToDb(data);
});

exports.getAssignments = functions.https.onCall((data, context) => {
  if (data.length === 0) {
    throw new functions.https.HttpsError("Invalid argument", 'the function must be called with ' +
      'one arguments "text" containing the message text to add')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }
  return db.collection('classroom').doc(data.classCode.toString()).collection('assignments').get().then((snapshot) => {
    const assignments = [];
    snapshot.forEach((doc) => {
      assignments.push(doc.data());
    });
    return assignments;
  });
});

function addAssignmentToDb(data) {
  const { assignment, dueDate, index, classCode } = data;
  return db.collection('classroom').doc(classCode.toString()).collection('assignments').doc(assignment.toString()).set({
    assignment: assignment,
    dueDate: dueDate,
    classCode: classCode,
    index: index
  })
}

function addUserToClassDb(classCode, teacherName, uid) {
  return db.collection('classroom').doc(classCode.toString()).set({
    teacherName: teacherName,
    classCode: classCode,
    uid: uid
  })
}

