const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const { signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const { firebaseAuth, auth } = require(path.join(__dirname, 'fire'))

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended:true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './frontend/views'));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

// Routes
app.get("/", (req, res) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      res.render('base', {
        displayName: user.email
      });
    } else {
      res.render('signup');
    }
  })
});


app.get('/signup', (req, res) => {
  res.render('signup');
})

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  firebaseAuth.createUserWithEmailAndPassword(auth, username, password).then((userCredential) => {
    const user = userCredential.user;
    res.redirect("/");
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.send(errorMessage);
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
    const errorCode = error.code;
    const errorMessage = error.message;
    res.send(errorMessage);
  })
});