const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

//config items
const config = require('./config.json');
const prefix = config.BOT_PREFIX;
const dataFolder = config.BOT_DATA_DIR;

//counter functions
const writeCounter = require('./counters').writeCounter;
const deleteCounter = require('./counters').deleteCounter;

const arrayUpdate = require('./counters').arrayUpdate; 
//bot start
console.log("Starting bot");
console.log(`Bot prefix is "${prefix}"`);
console.log(`Data directory is ${dataFolder}`);

//creates the data dir on first start
console.log('checking if the data directory exists')
if(!fs.existsSync(dataFolder)){
    console.warn('data directory does not exist, creating')
    fs.mkdirSync(dataFolder);
}else{console.log('data directory exists')};

client.on("messageCreate", function(message) { 
    //don't respond if a bot, or there's no command prefix
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    // split arguments from the command
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    //TODO is there a better way of doing this? 
        switch(command){
        //!ping or !p
        case "ping":
        case "p":
            message.reply("Pong!");
            break;
        
        //!CreateCounter or !cc
        case "createcounter":
        case "cc":
            //get first item in the args array, convert to lower cased string to stop duplicates
            const createCounterArrItem = args[0];
            const createCounterArrItemStr = createCounterArrItem.toLowerCase();
            const createCounter = createCounterArrItemStr;

            //try to create the object. Respond with result
            try{
                writeCounter(createCounter,message.createdTimestamp);
                const dateObject = new Date(message.createdTimestamp); //unix timestamp from the Discord message e.g. 1644839449
                const readableDateObject = dateObject.toLocaleString("en-gb"); 
                message.reply(`Counter "${createCounter}" created! I'll start counting from now! (${readableDateObject})`);
            }catch{
                message.reply(`Counter "${createCounter}" already exists!`);
            };
            break;
            
        //!ListCounters or !lc
        case "listcounters":
        case "lc":
            let arrayOfCounters = arrayUpdate()
            let cList = "";
            console.log(arrayOfCounters)
            if (arrayOfCounters.length === 0){
                message.reply("Currently no active counters!")
            }else{
                for (let i = 0; arrayOfCounters.length > i ;i++){
                    if(i === arrayOfCounters.length - 1) {
                        cList += (`${arrayOfCounters[i].name}.`)
                    } else {
                        cList += (`${arrayOfCounters[i].name}, `)   
                    }    
                }
                message.reply(`Current Timers: ${cList}`)
            }
            break;
                
        //!DeleteCounter or !dc
        case "deletecounter":
        case "dc":
            //get first item in the args array, convert to lower case to prevent duplicates
            const deleteCounterArrItem = args[0];
            const deleteCounterArrItemStr = deleteCounterArrItem.toLowerCase();
            const deleteableCounter = deleteCounterArrItemStr;

            //try to delete the object.
            try{
                deleteCounter(deleteableCounter);
                message.reply(`Counter "${deleteableCounter}" deleted!`)
            }catch{
                message.reply(`Counter "${deleteableCounter}" doesn't exist!`)
            };
            break;

    };

}); 

client.login(config.BOT_TOKEN);
