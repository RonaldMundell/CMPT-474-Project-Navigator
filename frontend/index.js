const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const authRoutes = require(path.join(__dirname, 'routes', 'auth'))
const { functions } = require(path.join(__dirname, 'common', 'fire'))
const { connectFunctionsEmulator } = require("firebase/functions");

const app = express();
const PORT = 8080;
const FUNCTIONS_PORT = 5001;

// disable this when deploying to production
connectFunctionsEmulator(functions, "localhost", FUNCTIONS_PORT);

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// views && view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/', authRoutes)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
//
