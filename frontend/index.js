const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const authRoutes = require(path.join(__dirname, 'routes', 'auth'))
const { connectFunctionsEmulator } = require("firebase/functions");
const { functions } = require(path.join(__dirname, 'common', 'fire'))

connectFunctionsEmulator(functions, "localhost", 5001);
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', authRoutes)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
//
