const config = require('../config.json');
const fs = require('fs');

function initBot(){
    // Bot startup
    console.log('Starting bot...');
    console.log(`Data directory is ${config.BOT_DATA_DIR}`);

    // Creates the data dir on first start
    console.log('checking if the data directory exists');
    if(!fs.existsSync(config.BOT_DATA_DIR)){
        console.warn('data directory does not exist, creating');
        fs.mkdirSync(config.BOT_DATA_DIR);
        console.log('Starting bot...Done!');
    }else{
        console.log('data directory exists, nothing to do');
        console.log('Starting bot...Done!');
    };
};

module.exports.initBot = initBot;
