const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readTimersFromDisk } = require('../bot-infra/readTimersFromDisk')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show-timers')
		.setDescription('Shows a list of the current Timers!'),

	async execute(interaction) {   
        //get list of Timers to create as fields, then create an object to pass to
        //.addFields where name: is name, and value is the last reset time. 
        //read timers from disk, and convert them to a format compatible with .addoptions
		const timers = readTimersFromDisk();

        //creating an empty aray to push into when iterating.
		let fieldTimers = []; 
        
        //foreach item in arr, create new obj with a Timer name and how long its
        //been running for
		for(let i = 0; i < timers.length; i++){

			const singleObjectTimer = {
				name: timers[i].name,
				value: `Has been running since ${timers[i].lastReset}`
			}

    	    fieldTimers.push(singleObjectTimer);

		};

        //building the embed to send
        const embed = new EmbedBuilder()
            .setTitle(`Here's the timers that are running:`)
            .addFields(fieldTimers)

		await interaction.reply({ embeds: [embed] });
	},
};
