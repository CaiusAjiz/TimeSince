const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

//config items
const config = require('./config.json');
const { timerReset } = require('./timers');
const dataFolder = config.BOT_DATA_DIR;
const prefix = config.BOT_PREFIX;

//Timer functions
const arrayUpdate = require('./timers').arrayUpdate; 
const deleteTimer = require('./timers').deleteTimer;
const formatDuration = require('./timers').formatDuration;
const helpText = require('./timers').helpText;
const writeTimer = require('./timers').writeTimer;
const renameTimer = require('./timers').renameTimer;

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
            if(!args[0]){
                message.reply(`Command ${command} needs a second argument to work`)
                break;
            }
            //get first item in the args array, convert to lower cased string to stop duplicates
            const createTimer = args.join(' ');

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
        
        //!help or !help command
        case "help":
            try{
                console.log("Trying to Find helptext");
                replyText = helpText(args[0]);
                message.reply(replyText);
            }catch{
                console.log("couldn't find helptext");
                //message.reply("I don't think that command exists pal.");
            };     
            break 
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
        case "deletetimer":
        case "dt":
            if(!args[0]){
                message.reply(`Command ${command} needs a second argument to work`)
                break;
            }
            //get first item in the args array, convert to lower case to prevent duplicates
            const deleteableTimer = args.join(' ');

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
            if(!args[0]){
                message.reply(`Command ${command} needs a second argument to work`)
                break;
            }
            let tscArray = arrayUpdate();
            let tscName = args.join(' ');
            let tscTarget = args.join('').toString().toLocaleLowerCase();
            for (let i = 0; tscArray.length > i ; i++){
                if (tscArray[i].id === tscTarget) {
                       let tscIndex = i;
                       console.log(`${tscTarget} is at index ${tscIndex}`)
                       message.reply(`${tscName} has been counting for ${formatDuration((message.createdTimestamp - tscArray[tscIndex].created)/1000)}`)
                       break;
                   } 
                if(i === tscArray.length - 1){
                        message.reply(`Timer ${tscName} does not exist`);
                    }
                }
            break;
        // RESET THE TIMER
        //!ResetTimer or !rt
        case "resettimer":
        case "rt":
            let rtArray = arrayUpdate();
            let rtcontext;
            if(rtArray.length === 0){
                message.reply("No timers currently created");
                break;
            }
            if(!args[0]){
                if(rtArray.length === 1){
                    if (rtArray[0].timesReset === 0){
                        message.reply(`RESET THE TIMER!! ${rtArray[0].name} has been counting for ${formatDuration((message.createdTimestamp - rtArray[0].lastReset)/1000)} This is its first reset`);
                        timerReset(0, message.createdTimestamp);
                        break; 
                       } else {
                        rtArray[0].timesReset > 1 ? rtcontext = "times" : rtcontext = "time";
                        message.reply(`RESET THE TIMER!! ${rtArray[0].name} was last reset ${formatDuration((message.createdTimestamp - rtArray[0].lastReset)/1000)} ago. This timer has been reset ${rtArray[0].timesReset} ${rtcontext}!`)
                        timerReset(0, message.createdTimestamp);
                        break;
                       }
                }
                message.reply(`What timer am I resetting?`) // TODO may want to change this if there is only one timer
                break;
            }
            let rtTarget = args.join('').toString().toLocaleLowerCase();
            let rtName = args.join(' ')
            for (let i = 0; rtArray.length > i ; i++){
                if (rtArray[i].id === rtTarget) {
                       let rtIndex = i;
                       if (rtArray[rtIndex].timesReset === 0){
                        message.reply(`RESET THE TIMER!! ${rtName} has been counting for ${formatDuration((message.createdTimestamp - rtArray[rtIndex].lastReset)/1000)} This is its first reset`);
                        timerReset(rtIndex, message.createdTimestamp);
                        break; 
                       } else {
                        rtArray[rtIndex].timesReset > 1 ? rtcontext = "times" : rtcontext = "time";
                        console.log(`${rtTarget} is at index ${rtIndex}`);
                        message.reply(`RESET THE TIMER!! ${rtName} was last reset ${formatDuration((message.createdTimestamp - rtArray[rtIndex].lastReset)/1000)} ago. This timer has been reset ${rtArray[rtIndex].timesReset} ${rtcontext} before!`)
                        timerReset(rtIndex, message.createdTimestamp);
                        break;
                    }
                   } 
                if(i === rtArray.length - 1){
                        message.reply(`Timer ${rtName} does not exist`);
                    }
                }
            break;
        // !rename or !rn
        case "rename":
        case "rn": //pass the old name and the new name then add a function to rewrite 
                if (!args.includes("=")){
                    message.reply("Please list the timer you want to rename followed by '= ' followed by the new name.")
                    break;
                }
                
                let nameChange = args.join(' ').split('= ');
                let oldName = nameChange[0].toString();
                let newName = nameChange[1].toString();

                console.log(`Old name:${oldName} New name:${newName}`);

                switch (renameTimer(oldName, newName)){
                    case "err1": //oldname does not exist
                    message.reply(`${oldName} does not exist`);
                    break;
                    case "err2": //newname in use
                    message.reply(`${newName} is in use please use another name`);
                    break;
                    default:
                        message.reply(`${oldName} has been changed to ${newName}`)
                        //for when it works
                }
                break;
                
    };

}); 

//log the bot in, it shows up in discord at this point
client.login(config.BOT_TOKEN);

//once logged in, set description.
//valid types https://discord.js.org/#/docs/discord.js/stable/typedef/ActivityType
client.on('ready', () => {
    client.user.setActivity(config.BOT_DESCRIPTION, {type : 'PLAYING'});
});
