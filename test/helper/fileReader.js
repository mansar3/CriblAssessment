const fs = require("fs");
const readLine = require("readline");

const fileReader = async (fileSource) => {
  const eventSet = new Set();
  const rl = readLine.createInterface({
    input: fs.createReadStream(fileSource),
    output: process.stdout,
    terminal: false,
  });

  for await (const line of rl) {
    // console.log(`Line ${line}`);
    eventSet.add(line);
  }

  rl.close();

  return eventSet;  
};


module.exports = {
  fileReader,
};
