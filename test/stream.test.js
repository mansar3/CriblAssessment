const mocha = require("mocha");
const expect = require("chai").expect;
const { check } = require("yargs");
const fr = require("./helper/fileReader");
const helper = require("./helper/setHelper");
const logHelper = require("./helper/logHelper");
const addContext = require("mochawesome/addContext");

describe("Stream Tests", function () {
  // Initialize sets used for the 3 individual files.
  // Decided to use sets for simplicity sake over maps as input data
  // is unique otherwise would have used a map for re-occurences.
  let eventSet1 = new Set();
  let eventSet2 = new Set();
  let inputSet = new Set();

  before("Data Setup", async function () {
    // Read file contents into appropriate set before starting tests.
    const file = "./agent/inputs/large_1M_events.log";
    inputSet = await fr.fileReader(file);

    const file2 = "./output/events1.log";
    eventSet1 = await fr.fileReader(file2);

    const file3 = "./output/events2.log";
    eventSet2 = await fr.fileReader(file3);
  });

  describe("Happy Path Tests", function () {
    // Test to validate that for every entry of the input set it should
    // make it into one of the targets.
    it("Verify All Inputs are accounted for in the Targets", function () {
      // Clone the initial set as we dont want to alter it, in case we need it for other test.
      const missingLinesSet = new Set(inputSet);
      
      // Create sets for the differences between target and input files
      let exceptSet1 = helper.except(missingLinesSet,eventSet1);
      let exceptSet2 = helper.except(missingLinesSet,eventSet2);
      // Remove all entries from the input set that match, leaving behind only entries that
      // did not make it into either of the targets.
      helper.removeAll(missingLinesSet, eventSet2);
      helper.removeAll(missingLinesSet, eventSet1);

      // Logging for the report/console
      logHelper.log(this, `event1 lines: ${eventSet1.size}`);
      logHelper.log(this, `event2 lines: ${eventSet2.size}`);
      logHelper.log(this, `input lines: ${inputSet.size}`);
      logHelper.log(this, "Lines that were not processed correctly and EXACT matches were not found in the targets:\n" + logHelper.toArrayForLogs(missingLinesSet));
      logHelper.log(this, "Target 1 incorrectly processed lines:\n" + logHelper.toArrayForLogs(exceptSet1));
      logHelper.log(this, "Target 2 incorrectly processed lines:\n" + logHelper.toArrayForLogs(exceptSet2));

      // Assertion to validate that the missing set is empty.
      expect(
        missingLinesSet,
        `Data from input file is missing in target sources (See report logs for more information). Missing data size: ${missingLinesSet.size}`
      ).to.be.empty;
    });

    // Test to validate that for any given input it ONLY exists in one of the
    // targets and not both.
    it("Verify No Duplicate Entries between the target entries", function () {
      // Find any entries that may be similar across either events.log files
      const interSet = helper.intersection(eventSet1, eventSet2);

      // Logging for the report.
      logHelper.log(this, `intersections lines: ${interSet.size}`);
      logHelper.log(this, `event1 lines: ${eventSet1.size}`);
      logHelper.log(this, 
        "Lines that were found to exist in both target 1 AND target 2:\n" + logHelper.toArrayForLogs(interSet));

      // Assertion to validate that the intersection set is empty.
      expect(
        interSet,
        `Data from input file seems to be on multiple target sources (See report logs for more information). Number of duplicates: ${interSet.size}`
      ).to.be.empty;
    });
  });
});
