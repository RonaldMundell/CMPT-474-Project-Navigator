// Import the functions you need from the SDKs you need
require('dotenv').config();
var firebaseApp = require("firebase/app");
var firebaseAuth = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(app);

module.exports = {
  auth,
  firebaseAuth
}
