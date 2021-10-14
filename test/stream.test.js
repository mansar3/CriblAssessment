const mocha = require('mocha')
const chai = require('chai');
const { check } = require('yargs');


const expect = chai.expect



describe('test1', function () {
    var eventSet = new Set();
    before('test1before', function (done) {
        const readLine = require('readline');
        const f = require('fs');
        var file = './agent/inputs/large_1M_events.log';
        
        var rl = readLine.createInterface({
            input : f.createReadStream(file),
            output : process.stdout,
            terminal: false
        });
        
        const start = async () =>{
            for await (const line of rl) {
                // console.log(line)
                eventSet.add(line);
            }
            console.log("done reading file");
            done();
        }
        start()
        
    });
  
    describe('is_null_input()', function () {
      it('should return a json string', function () {
        console.log("hellooo");
        console.log("lines:" , eventSet.size);
      });
    });
  
  });


// Group of tests using describe
// describe('fareUtils', function () {

//     var eventSet = new Set();

//     it('readFile', async function() {
//         const readLine = require('readline');
//         const f = require('fs');
//         var file = './agent/inputs/large_1M_events.log';
        
//         var rl = await readLine.createInterface({
//             input : await f.createReadStream(file),
//             output : process.stdout,
//             terminal: false
//         });
        
//         const t=  rl.on('line', function (text) {
//             console.log(text);
//             eventSet.add(text);
//         });

//         await t;

//         console.log("yayyy");
//         return rl;
//     })

//     // We will describe each single test using it
//     it('expect fare to be 50 for 0km, 0min', () => {
//         console.log("hellooo");
//         console.log("lines:" , eventSet.size);
//     })
  
//     it('expect fare to be 100 for 0km, 0min', () => {
//         console.log("hellooo");
//         console.log("lines:" , eventSet.size);
//     })
  
//     // it('expect fare to be 56 for 2km, 18min', () => {
//     //     let fare = fareUtils.calcFare(2, 18)
//     //     expect(fare).to.equal(56)
//     // })
// })