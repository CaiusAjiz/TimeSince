const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('secret-ping')
		.setDescription('Replies with Pong! then another Pong!'),
	async execute(interaction) {
		await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
		await interaction.followUp( {content: 'Pong Again!', ephemeral: true })
	},
};
