const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('delete-timer-selection')
		.setDescription('Shows all timers in a dropdown, picking one deletes it'),

	async execute(interaction) {

		if (interaction.customId === 'delete-timer'){
            console.log(interaction);
            await interaction.update({ content:'something was selected!', components: [] });
        }
	},
};
