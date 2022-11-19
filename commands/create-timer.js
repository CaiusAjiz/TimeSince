const { SlashCommandBuilder } = require('discord.js');
const { writeTimer } = require('../bot-infra/writeTimer');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-timer')
		.setDescription('creates a new timer to start counting. ')
        //attach an option and make it mandatory.
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription( `What do you want this called?`)
                .setRequired(true)),

	async execute(interaction) {
        //get the name from when the user puts it in.
        const timerName = interaction.options.getString('name');

		await interaction.reply( `Creating "${timerName}..."` );
        //try to create, it'll throw an error on any issue or if it already exists. So this is currently a lazy catch-all
        try {
            writeTimer(timerName,interaction.createdTimestamp);
            await interaction.editReply( `"${timerName}" created!` );
        }catch(error){
            await interaction.editReply( `Failed to make "${timerName}". Does it already exist?` );
        };
	},
};
