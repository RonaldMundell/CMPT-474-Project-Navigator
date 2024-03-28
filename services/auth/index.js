const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

initializeApp({
  serviceAccountId: 'firebase-adminsdk-t2mkj@classroom-navigator.iam.gserviceaccount.com'
});

exports.generateJWT = functions.https.onCall((data, context) => {
  const userId = data.userId;
  if (!userId) {
    return "userId is required";
  }

  if (!context.auth) {
    return "not authorized";
  }

  return getAuth().createCustomToken(userId);

});



async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const idToken = authHeader.split(' ')[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        return next();
      })
      .catch(error => {
        res.sendStatus(403); // forbidden
      })
  } else {
    // unauthorized
    res.sendStatus(401);
  }
}
