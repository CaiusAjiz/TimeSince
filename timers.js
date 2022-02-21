const fs = require("fs");
const dataFolder = require('./config.json').BOT_DATA_DIR;

//timers are stored in here
const file = `${dataFolder}/timers.json`;

//help text is in here
const helpFile = require('./help.json');

function arrayUpdate(){
    return JSON.parse(fs.readFileSync(file));
};

// helpText(args[0]); Outputs a string.
function helpText(commandToGetHelpTextFor){
    //JSON file, ./help.json is a dict of arrays, where it's "key": [0,1,2] where
    // "key": is the lowercase name of the command e.g. ping
    // 0 is the Proper name                        e.g. Ping  
    // 1 is the short command                      e.g. p
    // 2 is the Help Text                          e.g. "Responds with a 'Pong', use me with `!ping`"
    let helpFileString = "";
    if(typeof commandToGetHelpTextFor === 'undefined'){
        console.log("nothing in passed arguments, so getting all commands");
        
        timerArr = []
        //iterate over all key,values in the helpfile object, add the "Proper" name to an array
        for(const [key,value] of Object.entries(helpFile)){
            timerArr.push(value[0]);
        };
        //turn the array into a string separated by a newline
        const timerArrList = timerArr.join("\n ");
        helpFileString = `Hi there! \n Here's a list of all the commands you can use with me! \n use \`!help command\` for individual commands: \n ${timerArrList}`;
    }else{
        //convert to lowecase to allow for search against keys
        lowerCase = commandToGetHelpTextFor.toLowerCase();
        console.log(`Searching for "${lowerCase}"`);
        //See JSON File entry explanation above
        helpFileString = helpFile[lowerCase][2];
    };
    return helpFileString;
} 

// writeTimer("CaiSaidGucci","1644842334");
function writeTimer(timerName,timerCreationUnixTimeStamp){

    //building the Timer object to push into the array
    const timer = {
        name: timerName,
        created: timerCreationUnixTimeStamp,
        lastReset: timerCreationUnixTimeStamp,
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
 
    //if the name already exists in the timers file's objects, throw so function stops
    for(let i = 0; i < timerArray.length; i++){
        if(timerArray[i].name === timer.name){
            throw `${timer.name} already exists`;
        };
    };

    //appending to the imported JSON then writing. 
    timerArray.push(timer);

    //write to the file timers.json file
    fs.writeFile(file, JSON.stringify(timerArray, null, 2), (error) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(`Timers "${timer.name}" Written to disk`);
    });
    return;
};

// deleteTimer("CaiSaidGucci");
function deleteTimer(timerName){

    //empty array to use in a bit
    timerArray = [];

    //checking the timers JSON file exists, if so continue if not there's no Timers to delete
    try{
        fs.accessSync(file);
        console.log(`${file} can read / write`);
        console.log(`reading "${file}"`);
        timerArray = JSON.parse(fs.readFileSync(file));
    }catch{
        throw `Can't read/write ${file}, so no timers to delete`;
    };

    //checking for 0length array
    if(timerArray.length === 0){
        throw `There's nothing to delete`;
    }else{}; 

    //getting the index of the item in the array
    let index = 0
    for(let i = 0; i < timerArray.length; i++){
        if(timerArray[i].name === timerName){
            index = i;
            break;
        };
    };

    //remove item from array at discovered index
    console.log(`deleting "${timerName}" from index ${index}`);
    timerArray.splice(index,1);

    //Overwrite the file with the new array
    fs.writeFile(file, JSON.stringify(timerArray, null, 2), (error) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(`${file} written to disk`);
    });
    return
};

//function to format second into a human readable format
function formatDuration (seconds) {
    let wordArr = ['year','day','hour','minute','second'];
    let timeArr = [];
    let answer = [];
    let year = Math.floor(seconds/31536000);
    let day = Math.floor((seconds%31536000) / 86400);
    let hour = Math.floor((seconds%86400)/3600);  
    let mins = Math.floor((seconds%3600)/60);
    let secs = Math.floor(seconds%60);
    timeArr.push(year,day,hour,mins,secs);
    for (let i = 0 ; wordArr.length > i; i++){
      switch (timeArr[i]){
        case 0:
          break;
        case 1:
          answer.push(`${timeArr[i]} ${wordArr[i]}`);
          break;
        default:
          answer.push(`${timeArr[i]} ${wordArr[i]}s`);
      }
    }
    switch (answer.length){
      case 0:
        return 'now'
      case 1:
        return answer.toString('');
      default:
        let ending = answer[answer.length-1];
        answer.pop()
        return (`${answer.join(', ')} and ${ending}`)
    }
  }

  function timerReset(resetIndex, timeStamp){
    let timerArray = JSON.parse(fs.readFileSync(file));
    timerArray[resetIndex].timesReset ++;
    timerArray[resetIndex].lastReset = timeStamp;
    fs.writeFile(file, JSON.stringify(timerArray, null, 2), (error) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(`${file} written to disk`);
    });
  }

exports.arrayUpdate = arrayUpdate;
exports.deleteTimer = deleteTimer;
exports.formatDuration = formatDuration;
exports.helpText = helpText;
exports.writeTimer = writeTimer;
exports.timerReset = timerReset;