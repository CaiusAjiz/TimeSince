const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

//config items
const config = require('./config.json');
const prefix = config.BOT_PREFIX;
const dataFolder = config.BOT_DATA_DIR;

//Timer functions
const writeTimer = require('./timers').writeTimer;
const deleteTimer = require('./timers').deleteTimer;
const arrayUpdate = require('./timers').arrayUpdate; 
const formatDuration = require('./timers').arrayUpdate;

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
        
        //!CreateTimer or !ct
        case "createtimer":
        case "ct":
            //get first item in the args array, convert to lower cased string to stop duplicates
            const createTimerArrItem = args[0];
            const createTimerArrItemStr = createTimerArrItem.toLowerCase();
            const createTimer = createTimerArrItemStr;

            //try to create the object. Respond with result
            try{
                writeTimer(createTimer,message.createdTimestamp);
                const dateObject = new Date(message.createdTimestamp); //unix timestamp from the Discord message e.g. 1644839449
                const readableDateObject = dateObject.toLocaleString("en-gb"); 
                message.reply(`Timer "${createTimer}" created! I'll start counting from now! (${readableDateObject})`);
            }catch{
                message.reply(`Timer "${createTimer}" already exists!`);
            };
            break;
            
        //!ListTimers or !lc
        case "listtimers":
        case "lt":
            let arrayOfTimers = arrayUpdate()
            let cList = "";
            console.log(arrayOfTimers)
            if (arrayOfTimers.length === 0){
                message.reply("Currently no active Timers!")
            }else{
                for (let i = 0; arrayOfTimers.length > i ;i++){
                    if(i === arrayOfTimers.length - 1) {
                        cList += (`${arrayOfTimers[i].name}.`)
                    } else {
                        cList += (`${arrayOfTimers[i].name}, `)   
                    }    
                }
                message.reply(`Current Timers: ${cList}`)
            }
            break;
                
        //!DeleteTimer or !dt
        case "deleteTimer":
        case "dt":
            //get first item in the args array, convert to lower case to prevent duplicates
            const deleteTimerArrItem = args[0];
            const deleteTimerArrItemStr = deleteTimerArrItem.toLowerCase();
            const deleteableTimer = deleteTimerArrItemStr;

            //try to delete the object.
            try{
                deleteTimer(deleteableTimer);
                message.reply(`Timer "${deleteableTimer}" deleted!`)
            }catch{
                message.reply(`Timer "${deleteableTimer}" doesn't exist!`)
            };
            break;
        
        //!TimeSinceCreated or !tsc
        case "timesincecreated":
        case "tsc":
            let tscArray = arrayUpdate();
            let tscTarget = args[0].toString();
            for (let i = 0; tscArray.length > i ; i++){
                if (tscArray[i].name === tscTarget) {
                       let tscIndex = i;
                       console.log(`${tscTarget} is at index ${tscIndex}`)
                       message.reply(`${tscTarget} has been counting for ${formatDuration((Date.now() - tscArray[tscIndex].created)/1000)}`)
                       break;
                   } 
                if(i === tscArray.length - 1){
                        message.reply(`Timer ${tscTarget} does not exist`);
                    }
                }
            break;
    };

}); 

client.login(config.BOT_TOKEN);
