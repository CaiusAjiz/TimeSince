const fs = require('node:fs');
const { BOT_DATA_DIR } = require('../config.json');

//timers are stored in here
const file = `${BOT_DATA_DIR}/timers.json`;

function readTimersFromDisk(){
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
    return timerArray;
}

module.exports.readTimersFromDisk = readTimersFromDisk;
