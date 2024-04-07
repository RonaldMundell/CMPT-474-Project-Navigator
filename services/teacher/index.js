const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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
  return addTeacherToClassDb(classCode, teacherName, uid);
});

exports.addStudentToClassroom = functions.https.onCall((data, context) => {
  if (data.length === 0) {
    throw new functions.https.HttpsError("Invalid argument", 'the function must be called with ' +
      'one arguments "text" containing the message text to add')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }
  return addStudentToDb(data);
});


exports.getClassrooms = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  const query1 = db.collection('classroom').where('uid', '==', data.user);
  const query2 = db.collection('classroom').where('students', 'array-contains', data.user);
  const [snapshot1, snapshot2] = await Promise.all([query1.get(), query2.get()]);
  const classrooms = [];
  snapshot1.forEach((doc) => {
    classrooms.push(doc.data());
  });
  snapshot2.forEach((doc) => {
    classrooms.push(doc.data());
  });
  return classrooms;
});

exports.getAllClassrooms = functions.https.onCall((_, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed pre-condition', 'the function must be called' +
      'while authenticated');
  }

  return db.collection('classroom').get().then((snapshot) => {
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

function addStudentToDb(data) {
  const { classCode, user } = data;
  return db.collection('classroom').doc(classCode.toString()).update({
    students: FieldValue.arrayUnion(user)
  });
}

function addTeacherToClassDb(classCode, teacherName, uid) {
  return db.collection('classroom').doc(classCode.toString()).set({
    teacherName: teacherName,
    classCode: classCode,
    uid: uid
  })
}

