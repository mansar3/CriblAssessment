const fs = require("fs");
const readLine = require("readline");

// Async function to read in the file of the
// applicable file.
const fileReader = async (fileSource) => {
  // Create placeholder Set
  const eventSet = new Set();

  // Create interface to read in the lines from the file
  const rl = readLine.createInterface({
    input: fs.createReadStream(fileSource),
    output: process.stdout,
    terminal: false,
  });

  // Iterate through and insert it into the Set
  for await (const line of rl) {
    // console.log(`Line ${line}`);
    eventSet.add(line);
  }

  // Close the interface
  rl.close();

  return eventSet;
};

// Export the function for use in other files.
module.exports = {
  fileReader,
};
