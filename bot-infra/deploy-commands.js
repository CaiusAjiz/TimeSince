const { REST, Routes } = require('discord.js');
const { CLIENTID, GUILDID, BOT_TOKEN } = require('../config.json');
const path = require('node:path');
const fs = require('node:fs');

function deployCommands(){
	console.log("Deploying Commands...");

	const commands = [];
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(__dirname, '..','commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const command = require(`${commandsPath}/${file}`);
		commands.push(command.data.toJSON());
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationGuildCommands(CLIENTID, GUILDID),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
			console.log("Deploying Commands...Done!");
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
};

module.exports.deployCommands = deployCommands;