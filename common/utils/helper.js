// This will be a file for common code/function

/* How to import:

const { formatDate, isValidEmail } = require('../common/utils/helper');

*/

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Simple email validation
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
