const mocha = require("mocha");
const expect = require("chai").expect;
const { check } = require("yargs");
const fr = require("./helper/fileReader");
const helper = require("./helper/setHelper");
const addContext = require('mochawesome/addContext');

describe("Stream Tests", function () {
  let eventSet1 = new Set();
  let eventSet2 = new Set();
  let inputSet = new Set();
  before("Data Setup", async function () {
    const file = "./agent/inputs/large_1M_events.log";
    inputSet = await fr.fileReader(file);

    const file2 = "./output/events1.log";
    eventSet1 = await fr.fileReader(file2);

    const file3 = "./output/events2.log";
    eventSet2 = await fr.fileReader(file3);
  });

  describe("Happy Path Tests", function () {
    it("Verify All Inputs are accounted for in the Targets", function () {
      const missingLinesSet = new Set(inputSet);

      helper.removeAll(missingLinesSet, eventSet2);
      helper.removeAll(missingLinesSet, eventSet1);

      // console.log("input lines:", inputSet.size);
      // console.log("missing lines:", missingLinesSet.size);
      // console.log("event1 lines:", eventSet1.size);
      // console.log("event2 lines:", eventSet2.size);
      // console.log("input lines:", inputSet.size);


      addContext(this, `event1 lines: ${eventSet1.size}`);
      addContext(this, `event2 lines: ${eventSet2.size}`);
      addContext(this, `input lines: ${inputSet.size}`);
      addContext(this, `number of missing lines: ${missingLinesSet.size}`);
      addContext(this, `missing lines: ${missingLinesSet}`);

      expect(
        missingLinesSet,
        `Data from input file is missing in target sources. Missing data size: ${missingLinesSet.size}`
      ).to.be.empty;
    });

    it("Verify No Duplicate Entries between the target entries", function () {
      const interSet = helper.intersection(eventSet1, eventSet2);

      // console.log("intersections lines:", interSet.size);
      // console.log("event1 lines:", eventSet1.size);
      // console.log("event2 lines:", eventSet2.size);

      addContext(this, `intersections lines: ${interSet.size}`);
      addContext(this, `event1 lines: ${eventSet1.size}`);
      addContext(this, `event2 lines: ${eventSet2.size}`);

      expect(
        interSet,
        `Data from input file seems to be on multiple target sources. Number of duplicates: ${interSet.size}`
      ).to.be.empty;
    });
  });
});
