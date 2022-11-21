const fs = require('node:fs');
const { BOT_DATA_DIR } = require('../config.json');
const { readTimersFromDisk } = require('./readTimersFromDisk');

//timers are stored in here
const file = `${BOT_DATA_DIR}/timers.json`;

function writeTimer(timerName,messageTimestamp){

    const timer = {
        name: timerName,
        created: messageTimestamp,
        lastReset: messageTimestamp,
        timesReset: 0
    };
    //read timers from disk. 
    let timerArray = readTimersFromDisk();

    //If the name already exists in the JSON file, throw so func stops
    //the .toLowerCase is to make sure that we can't accidentally get 
    //duplicated like "Test" and "test".
    for(let i = 0; i < timerArray.length; i++){
        if(timerArray[i].name.toLowerCase() === timer.name.toLowerCase()){
            throw 'alreadyExists';
        };
    };

    //append the "timer" array built at the start of the func to the end of the 
    //imported array 
    timerArray.push(timer);

    //write to the file timers.json file
    fs.writeFile(file, JSON.stringify(timerArray, null, 2), (error) => {
        if(error){
            console.log(error);
            throw error;
        }
        console.log(`"${timer.name}" Written to disk`);
    });
    return;
};

module.exports.writeTimer = writeTimer;
