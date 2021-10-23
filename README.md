# Project Setup

### Requirements
- Node v12 or greater
- Docker

### Links for Requirements
- NVM (Node Version Manager): https://github.com/nvm-sh/nvm (Only for mac) <- Once installed just run ```nvm install node``` to get the latest version of node 
- Docker: https://docs.docker.com/get-docker/ 

### Steps to Run test
1. Navigate to project root directory
1. ```npm install```: Installs project testing dependencies(mocha,chai etc..)
1. ```docker-compose up```: Brings up the individual applications(target 1 & 2, splitter, and agent)
1. ```npm run data```: Pulls ```events.log``` files from containers into local project under ```./output/```
1. ```npm test```: Runs all tests within the test folder and generates the report.

### CICD
This project uses Github Actions for its CI pipeline. You can find the workflow runs right above this under the `Actions` tab. Currently it is set to only run when something is merged to master OR when manually kicked off. 

There are 3 jobs in the workflow:

1. Build - Brings up the applications, retrieves the Data, and brings down the containers.
1. Test - Runs all the mocha tests.
1. Report - Publishes the report to Github Pages.

You can find all of the steps related to the CI Pipeline in the project in here: `.github/workflows/main.yml`

### Reporting

#### Running Local
The report is inherently created as part of the `npm test` script. In the console you can find the output for the latest report(which is in the project root directory). If using a mac the preview functionality will not work as it will show a blank page but if you double-click the `index.html` it will open it properly in a browser window.

#### Running using CI
The report after a CI run usually takes a minute to publish to github Pages. The latest report can be found at:

https://mansar3.github.io/CriblAssessment/

#### Future iterations
It would be nice to have history tracking across the individual test cases themselves. This would require the reports to persist past the longevitiy of the workflow. This was one of the reasons why I opted to use Github Actions Artifacts over caches in relation to the reports. 

# Issues/ Thought Process

## Setup

#### Containerization
In order to get all the apps to communicate with each other I used docker (per Sunnys suggestion). After setting up the individual docker files, I used docker compose to spin up all the apps in an automated fashion.

#### Data Aggregation
Initially I tried to retrieve the file using a docker mount from the host directory and the container directory(`/usr/src/app`). It worked great, however, the issue was that with multiple files of the same name `events.log` they would overwrite each other. I then looked into docker volumes but found that I would run into the same issue. I then decided to just use the `docker cp` command to retrieve the files and place them in the `./output` folder. I then made a script for this in the package.json to make this easier: `npm run data`. I did not want to bundle it with the `npm test` script as I didnt want to retrieve the files everytime unless explicitily needed by the user. 

## Tests

#### Stack
- Mocha
- Chai
- Mochawesome Reporting

Without going into the many pros and cons of each one(which you'll find many articles online that do), I wanted something quick to implement that would also not have too many dependencies.

#### Test Cases

I focused on creating integration tests based on the comparison of the Agent input file and the Target events.log output files. As such the test cases validated the states at the beginning and the end of the application flow. However, the requirements did not include specifications of the data, as such, I only tested the data existed and was equivalent between two points. 

1. Verify that all data in the input file exists somehwere between the two target log files.

- This is to verify that for each line in `large_1M_events.log` that it is in either target 1 or 2s' events.log file.

2. Verify that for each input line their exists only one entry between the two target files. 

- This is to verify that for each line in `large_1M_events.log' that it is ONLY found in one of the target event.log files.

3. Verify there is no extra data that exists in target 1 that does not exist in the input file

  - This is to verify that no extra data exists in target 1 that does not exist in the input file

4. Verify there is no extra data that exists in target 2 that does not exist in the input file

  - Same as #3 but for target 2

#### Ideal Test Case

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
- It was easy to implement with my existing repo. Features such as node and docker are ready to be used right out of the box.
- I had more experience with gitlab and wanted to use this opportunity to compare the two.

#### Issues

- Repo Persistance: I wanted to break the pipeline into 3 stages: build, test, and report. To do this however I needed to persist the repo as Github Actions creates a fresh VM for every job even if they exist in the same workflow. Initially I created an artifact of the whole repo as I wouldn't need to pull it down again or have to install the dependencies again. The issue I saw was the upload and download of the artifacts was slow. I then changed it to only create an artifact of the output folder which holds the events.log files.

- Data aggregation: It seemed that after the docker containers were up and running the next step `npm run data` was executing too quickly in the pipeline and the file was not being found. In order to circumnavigate this issue I added a small wait time in between the steps(5s). Build for reference:
https://github.com/mansar3/CriblAssessment/runs/3918724030?check_suite_focus=true






