const Discord = require("discord.js");
const config = require("./config.json");

const prefix = config.BOT_PREFIX;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

client.on("messageCreate", function(message) { 
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if(command === "ping"){
        message.reply("Pong.");
    }

}); 

client.login(config.BOT_TOKEN);
