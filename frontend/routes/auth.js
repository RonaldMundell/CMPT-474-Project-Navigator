const express = require('express');
const path = require('path')
const router = express.Router();

const { signInWithEmailAndPassword } = require('firebase/auth');
const { httpsCallable } = require("firebase/functions");
const { firebaseAuth, auth, functions } = require(path.join(__dirname, '..', 'common', 'fire'))

// Routes
router.get("/", (_, res) => {
  const auth = firebaseAuth.getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    res.render('base', {
      displayName: user.email,
    });
  } else {
    res.render('signup')
  }
});

router.get("/classrooms", async (_, res) => {
  const getClassrooms = httpsCallable(functions, 'getClassrooms');
  const getAssignments = httpsCallable(functions, 'getAssignments');
  try {
    user = firebaseAuth.getAuth().currentUser;
    if (user !== null) {
      let arr = [];
      const classrooms = await getClassrooms({ user: user.uid });
      for (let classroom of classrooms.data) {
        const assignments = await getAssignments({ classCode: classroom.classCode });
        arr.push(assignments.data)
      }
      console.log(arr);
      res.render('classrooms', {
        classrooms: classrooms.data,
        assignments: arr
      });
    }
  }
  catch {
    error => {
      console.log("classroom", error);
    }
  }
});

router.post("/classrooms", (req, res) => {
  const { assignment, dueDate, index, classCode } = req.body;
  try {
    user = firebaseAuth.getAuth().currentUser;
    if (user !== null) {
      const addAssignment = httpsCallable(functions, 'addAssignment')
      let assignmentDocument = {
        assignment: assignment,
        dueDate: dueDate,
        index: index,
        classCode: classCode
      }
      addAssignment(assignmentDocument);
      console.log(assignmentDocument);
    }
  }
  catch {
    error => console.log("assignment", error);
  }
});

router.get('/students', async (req, res) => {
  try {
    user = firebaseAuth.getAuth().currentUser;
    if (user !== null) {
      const getAllClassrooms = httpsCallable(functions, 'getAllClassrooms');
      const classrooms = await getAllClassrooms();
      res.render('students', {
        classrooms: classrooms.data,
        user: user.uid
      });
    } else {
      res.render('badRequest');
    }
  }
  catch {
    error => console.log("students", error);
  }
});

router.post('/students', async (req, res) => {
  try {
    user = firebaseAuth.getAuth().currentUser;
    if (user !== null) {
      const { classCode, student } = req.body;
      const addStudentToClassroom = httpsCallable(functions, 'addStudentToClassroom');
      await addStudentToClassroom({ classCode: classCode, user: student });
      res.status(200).send("student added");
    }
  } catch {
    error => console.log("students post:", error);
  }
});


router.post("/", async (req, res) => {
  // add teacher
  const { teacher, classroom } = req.body;
  console.log(teacher, classroom);
  const addClassroom = httpsCallable(functions, 'addClassroom')
  await addClassroom({
    classCode: classroom,
    teacherName: teacher
  }).then((result) => {
    console.log(result.data);
    res.redirect('/')
  }).catch((error) => {
    console.log("error", error);
    console.log("code", error.code);
    console.log("message", error.message);
    console.log("details", error.details);
  })


  // add student
  const { studentName, classroomCode } = req.body;
  var addStudent = httpsCallable(functions, 'addStudent')
  addStudent({
    studentName: studentName,
    classroomCode: classroomCode
  }).then((result) => {
    console.log(result.data);
    res.redirect('/')
  }).catch((error) => {
    console.log("error", error);
    console.log("code", error.code);
    console.log("message", error.message);
    console.log("details", error.details);
  })
});


router.get('/signup', (req, res) => {
  res.render('signup');
})

router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  console.log(username, password);

  const addUserAfterCreation = httpsCallable(functions, 'addUserAfterCreation')
  firebaseAuth.createUserWithEmailAndPassword(auth, username, password)
    .then(async (userCred) => {
      uid = userCred.user.uid;
      try {
        await addUserAfterCreation({ email: username, uid, role });
      }
      catch (_) {
        console.log("Could not add the user to db after creation...")
      }
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      res.redirect('/signup');
    })
})

router.get('/login', (_, res) => {
  res.render('login');
})


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  signInWithEmailAndPassword(auth, username, password).then((userCredential) => {
    const user = userCredential.user;
    console.log("Logged in as", user);
    res.redirect("/");
  })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.redirect('/login');
    })
});
module.exports = router;
