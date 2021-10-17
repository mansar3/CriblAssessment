# Project Setup

#### Requirements
- Node v12 or greater
- Docker

#### Links for Requirements
- NVM (Node Version Manager): https://github.com/nvm-sh/nvm <- Once installed just run ```nvm install node``` to get the latest version of node 
- Docker: https://docs.docker.com/get-docker/ 

### Steps to Run test
- Navigate to project root directory
- ```npm install```: Installs project testing dependencies(mocha,chai etc..)
- ```docker-compose up```: Brings up the individual applications(target 1 & 2, splitter, and agent)
- ```npm run data```: Pulls ```events.log``` files from containers into local project under ```./output/```
- ```npm test```: Runs all tests within the test folder.

# Issues/ Thought Process
This was a great assessment, it felt really applicable to what I had discussed with Sunny during the initial interview. This next part will be more 

## Setup

#### Ports
Initially the ports presented a problem as multiple processes can not run on the same host port. After a suggestion from sunny I implemented the applications into the containers. The problem however was that input/output.jsons needed to me modified to separate ports still. I was considering implementing a reverse proxy using `nginx` but after working with the individual docker files I exposed the containers to different ports while mapping it internally to `9997` for all the applicable applications. In this way I didn't need to touch any of the files at all

#### Data Aggregation
Initially I tried to retrieve the file using a docker mount from the host directory and the container directory(`./usr/src/app`). It worked great however the issue was that with multiple files of the same name `events.log` they would overwrite each other. I then looked into docker volumes but found that I would run into the same issue. I then decided to just use the `docker cp` command to retrieve the files and place them in the `./output` folder. I then made a script for this in the package.json to make this easier: `npm run data`. I did not want to bundle it with the `npm test` script as I didnt want to retrieve the files everytime unless explicitily needed by the user. 

## Tests

#### Stack
- Mocha
- Chai

Without going into the many pros and cons of each one(which you'll find many articles on line that do), I wanted something quick to implement that would also not have too many dependencies. The only issue I ran into in this case was the asynchronous call to read in data from all 3 files, which I later realized was due to not closing my interface after reading each file. 

#### Test Cases
- Verify that all data in the input file exists somehwere between the two target log files.
- Verify that the target log files don't have duplicate entries between themselves .
- Verify that the individual files don't have duplicate entries within themselves. 


## CICD


#### Choice


#### Issues



