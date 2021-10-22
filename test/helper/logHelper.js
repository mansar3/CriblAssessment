const addContext = require("mochawesome/addContext");

// Function to format the sets for use by mochawesome reports
function toArrayForLogs(originalSet) {
  return Array.from(originalSet).join("\n");
}

// Function to log to both console and test report
function log(context, str) {
  addContext(context, str);

  console.log(str + "\n");
}

// Export functions for use in other files
module.exports = {
  log,
  toArrayForLogs,
};
