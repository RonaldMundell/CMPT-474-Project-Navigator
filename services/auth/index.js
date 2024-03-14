const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const { signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const { connectFunctionsEmulator, getFunctions, httpsCallable } = require ("firebase/functions");
const { firebaseAuth, auth, functions } = require(path.join(__dirname, 'fire'))

// connectFunctionsEmulator(functions, "localhost", 5001); 
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended:true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './frontend/views'));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
//
// Routes
app.get("/", (req, res) => {
  const auth = firebaseAuth.getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      res.render('base', {
        displayName: user.uid,
      });
    } else {
      res.render('signup');
    }
  })
});

app.post("/", (req, res) => {
  // add teacher
  const {teacher, classroom} = req.body;
  console.log(teacher, classroom);
  var addClassroom = httpsCallable(functions, 'addClassroom')
  addClassroom({
    classCode: classroom,
    teacherName: teacher
  }).then((result) => {
    console.log(result.data);
    res.redirect('/')
  }).catch((error) => {
    console.log( "error", error );
    console.log( "code", error.code );
    console.log( "message", error.message );
    console.log( "details", error.details );
  })


  // add student
  const {studentName, classroomCode } = req.body;
  var addStudent = httpsCallable(functions, 'addStudent')
  addStudent({
    studentName: studentName,
    classroomCode: classroomCode
  }).then((result) => {
    console.log(result.data);
    res.redirect('/')
  }).catch((error) => {
    console.log( "error", error );
    console.log( "code", error.code );
    console.log( "message", error.message );
    console.log( "details", error.details );
  })
});


app.get('/signup', (req, res) => {
  res.render('signup');
})

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  firebaseAuth.createUserWithEmailAndPassword(auth, username, password).then((userCredential) => {
    // const user = userCredential.user;
    res.redirect("/");
  })
  .catch((error) => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    res.redirect('/signup');
  })
})

app.get('/login', (req, res) => {
  res.render('login');
})


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    const user = userCredential.user;
    res.redirect("/");
  })
  .catch((error) => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    res.redirect('/login');
  })
});