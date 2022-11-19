const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deferred-ping')
		.setDescription('Replies with Pong, after a delay'),
	async execute(interaction) {
		await interaction.deferReply();
        await wait(4000);
        await interaction.editReply('Pong!');
	},
};
