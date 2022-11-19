const fs = require('node:fs');
const { BOT_DATA_DIR } = require('../config.json')

//timers are stored in here
const file = `${BOT_DATA_DIR}/timers.json`;

function writeTimer(timerName,messageTimestamp){

    const timer = {
        name: timerName,
        created: messageTimestamp,
        lastReset: messageTimestamp,
        timesReset: 0
    };

    //creating empty array to push object to 
    let timerArray = [];

    //checking the timers JSON file exists, if so read and use if not it'll be created on write
    try{
        fs.accessSync(file);
        console.log(`${file} can read / write`);
        console.log(`reading "${file}"`);
        timerArray = JSON.parse(fs.readFileSync(file));
    }catch{
        console.warn(`Can't read/write ${file}, I'll create it`);
    };

    //If the name already exists in the JSON file, throw so func stops
    for(let i = 0; i < timerArray.length; i++){
        if(timerArray[i].name === timer.name){
            console.log()
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
