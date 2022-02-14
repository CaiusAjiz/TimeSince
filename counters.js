const fs = require("fs");
const dataFolder = require('./config.json').BOT_DATA_DIR;

//Counters are stored in here
const file = `${dataFolder}/counters.json`;

function arrayUpdate(){
    return JSON.parse(fs.readFileSync(file));
};

// writeCounter("CaiSaidGucci","1644842334");
function writeCounter(counterName,counterCreationUnixTimeStamp){

    //building the Counter object to push into the array
    const counter = {
        name: counterName,
        created: counterCreationUnixTimeStamp
    };

    //creating empty array to push object to 
    let counterArray = [];

    //checking the counters JSON file exists, if so read and use if not it'll be created on write
    try{
        fs.accessSync(file);
        console.log(`${file} can read / write`);
        console.log(`reading "${file}"`);
        counterArray = JSON.parse(fs.readFileSync(file));
    }catch{
        console.warn(`Can't read/write ${file}, I'll create it`);
    };
 
    //if the name already exists in the counters file's objects, throw so function stops
    for(let i = 0; i < counterArray.length; i++){
        if(counterArray[i].name === counter.name){
            throw `${counter.name} already exists`;
        };
    };

    //appending to the imported JSON then writing. 
    counterArray.push(counter);

    //write to the file counters.json file
    fs.writeFile(file, JSON.stringify(counterArray, null, 2), (error) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(`Counter "${counter.name}" Written to disk`);
    });
    return;
};

// writeCounter("CaiSaidGucci");
function deleteCounter(counterName){

    //empty array to use in a bit
    counterArray = [];

    //checking the counters JSON file exists, if so continue if not there's no Counters to delete
    try{
        fs.accessSync(file);
        console.log(`${file} can read / write`);
        console.log(`reading "${file}"`);
        counterArray = JSON.parse(fs.readFileSync(file));
    }catch{
        throw `Can't read/write ${file}, so no counters to delete`;
    };

    //checking for 0length array
    if(counterArray.length === 0){
        throw `There's nothing to delete`;
    }else{}; 

    //getting the index of the item in the array
    let index = 0
    for(let i = 0; i < counterArray.length; i++){
        if(counterArray[i].name === counterName){
            index = i;
            break;
        };
    };

    //remove item from array at discovered index
    console.log(`deleting "${counterName}" from index ${index}`);
    counterArray.splice(index,1);

    //Overwrite the file with the new array
    fs.writeFile(file, JSON.stringify(counterArray, null, 2), (error) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(`${file} written to disk`);
    });
    return
};

exports.writeCounter = writeCounter;
exports.arrayUpdate = arrayUpdate;
exports.deleteCounter = deleteCounter;
