const { Events, ActivityType } = require('discord.js');
const { BOT_DESCRIPTION } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        if ( BOT_DESCRIPTION === "" ) return;
        
        client.user.setActivity({ name: `${BOT_DESCRIPTION}`, type: ActivityType.Playing })
        console.log(`setActivity complete! Set to ${BOT_DESCRIPTION}`)
	},
};
