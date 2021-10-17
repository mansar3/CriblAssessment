const mocha = require("mocha");
const expect = require("chai").expect;
const { check } = require("yargs");
const fr = require("./helper/fileReader");
const helper = require("./helper/setHelper");


describe("Stream Tests", function () {
  let gatheredSet = new Set();
  let gatheredSet2 = new Set();
  let eventSet = new Set();
  before("Data Setup", async function () {
    const file = "./agent/inputs/large_1M_events.log";
    eventSet = await fr.fileReader(file);
    // console.log("back in before method");

    const file2 = "./output/events1.log";
    gatheredSet = await fr.fileReader(file2);
    // console.log("back in before method");

    const file3 = "./output/events2.log";
    gatheredSet2 = await fr.fileReader(file3);
    // console.log("back in before method");
  });

  describe("Happy Path Tests", function () {
    it("Verify All Inputs are accounted for in the Targets", function () {
      const tempSet = new Set(eventSet);

      helper.removeAll(tempSet, gatheredSet2);
      helper.removeAll(tempSet, gatheredSet);

      // console.log(tempSet.size);
      console.log("missing lines:", tempSet.size);
      console.log("gathered lines:", gatheredSet.size);
      console.log("gathered2 lines:", gatheredSet2.size);
      console.log("input lines:", eventSet.size);

      // const expect = chai.expect;
      expect(tempSet,`Data from input file is missing in target sources. Missing data size: ${tempSet.size}`).to.be.equal(0)
      // assert.lengthOf(tempSet.size,0, `Data from input file are missing in target sources. Missing data size: ${tempSet.size}`)
      // console.log(tempSet);
    });

    it("Verify No Duplicate Entries between the target entries", function () {
      const interSet = helper.intersection(gatheredSet, gatheredSet2);
      // console.log(tempSet.size);
      console.log("intersections lines:", interSet.size);
      console.log("gathered lines:", gatheredSet.size);
      console.log("gathered2 lines:", gatheredSet2.size);

      // const expect = chai.expect;
      expect(interSet,`Data from input file seems to be on multiple target sources. Number of duplicates: ${interSet.size}`).to.be.equal(0)
      // console.log(tempSet);
    });
  });
});
