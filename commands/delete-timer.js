const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { readTimersFromDisk } = require('../bot-infra/readTimersFromDisk');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('delete-timer')
		.setDescription('Shows all timers in a dropdown, picking one deletes it'),

	async execute(interaction) {

		//read timers from disk, and convert them to a format compatible with .addoptions
		const timers = readTimersFromDisk();
		let optionTimers = []; 

		for(let i = 0; i < timers.length; i++){
			const singleObjectTimer = {
				label: timers[i].name,
				description: timers[i].name,
				value: timers[i].name
			}

    	optionTimers.push(singleObjectTimer);

		};

		//build the options for the list
		const row = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('delete-timer')
				.setPlaceholder('Select a timer to delete')
				.addOptions(optionTimers),
		)
		//respond with the built list. 
		await interaction.reply({content: 'Select a Timer to delete it.', components: [row], ephemeral: true});
	},
};
