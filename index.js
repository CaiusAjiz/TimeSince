// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
// Bot Startup related classes and config
const { initBot } = require('./bot-infra/startup')
const { BOT_TOKEN, BOT_NAME } = require('./config.json');
const { deployCommands } = require('./bot-infra/deploy-commands');

// Start the bot up, creating dirs and files if necessary
initBot();
deployCommands();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a new collection 
client.commands = new Collection();

// Gathering Commands to include
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Gathering Events to include
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(BOT_TOKEN);
