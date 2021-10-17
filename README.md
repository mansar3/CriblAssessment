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
- ```npm test```: Runs all tests within the test folder and generates the report.


### Reporting

#### Running Local
The report is inherently created as part of the `npm test` script. In the console you can find the output for the report(which is in the project root directory). If using a mac the preview functionality will not work as it will show a blank page but if you double-click the `index.html` it will open it properly in a browser window.

#### Running using CI
The report after a CI run usually takes a minute to publish to github Pages. The report can be found at:

https://mansar3.github.io/CriblAssessment/


# Issues/ Thought Process

## Setup

#### Ports
Initially the ports presented a problem as multiple processes can not run on the same host port. After a suggestion from Sunny I implemented the applications into the containers. The problem however was that input/output.jsons needed to be modified to unique ports still. I was considering implementing a reverse proxy using `nginx` but after working with the individual docker files, I exposed the containers to different ports while mapping it internally to `9997` for all the applicable applications. In this way I didn't need to touch any of the files at all.

#### Data Aggregation
Initially I tried to retrieve the file using a docker mount from the host directory and the container directory(`/usr/src/app`). It worked great, however, the issue was that with multiple files of the same name `events.log` they would overwrite each other. I then looked into docker volumes but found that I would run into the same issue. I then decided to just use the `docker cp` command to retrieve the files and place them in the `./output` folder. I then made a script for this in the package.json to make this easier: `npm run data`. I did not want to bundle it with the `npm test` script as I didnt want to retrieve the files everytime unless explicitily needed by the user. 

## Tests

#### Stack
- Mocha
- Chai
- Mochawesome Reporting

Without going into the many pros and cons of each one(which you'll find many articles online that do), I wanted something quick to implement that would also not have too many dependencies. The only issue I ran into in this case was the asynchronous call to read in data from all 3 files, which I later realized was due to not closing my interface after reading each file. 

#### Test Cases
- Verify that all data in the input file exists somehwere between the two target log files.
- Verify that for each input line their exists only one entry between the two target files. 

#####Ideal Test Case

I spent some time looking into the logic:

```
            var idx = data.indexOf("\n");
            var part_1 = "";
            var part_2 = "";
            if (idx == -1) {
                part_1 = data;
                writeToSocket(part_1, outSocks[sockIdx], localSocket);
            }
            else {
                part_1 = data.slice(0, idx + 1); /* include the line termination */
                part_2 = data.slice(idx + 1);
                writeToSocket(part_1, outSocks[sockIdx], localSocket);
                sockIdx++;
                sockIdx %= outSocks.length;
                writeToSocket(part_2, outSocks[sockIdx], localSocket);
```

Ideally we'd be able to confirm which line each target belongs to. The issue however is the ever-changing buffer size(avg 56683-65529 characters on my local machine) which affects part_2. Even if I was able to re-implement the same logic on the testing side I would not be guaranteed to have the same buffer size. If we were however able to retrieve or store the buffer sizes or even use a more concrete way of splitting the input (in terms of app logic) we'd be able to create a more beneficial test case out of it. 


## CICD

#### Choice
I opted to use Github Actions for 2 reasons:
- It was easy to implement with my existing repo.
- I had never used it before so wanted to do the assessment and learn about it in the process.

#### Issues

- Repo Persistance: I wanted to break the pipeline into 3 stages: build, test, report. To do this however I needed to persist the repo as Github Actions creates a fresh VM for every job even if they exist in the same workflow. Initially I created an artifact of the whole repo as I wouldn't need to pull it down again or have to install the dependencies again. The issue I saw was the upload and download of the artifacts was slow. I then changed it to only create an artifact of the output folder which holds the events.log files.

- Data aggregation: It seemed that after the docker containers were up and running the next step `npm run data` was executing too quickly in the pipeline and the file was not being found. In order to circumnavigate this issue I added a small wait time in between the steps(5s). Build for reference:
https://github.com/mansar3/CriblAssessment/runs/3918724030?check_suite_focus=true






