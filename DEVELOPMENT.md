# Development
This markdown doc describes how to get started developing on this bot.

## Getting started. 

### Getting set up
- You'll need Node.JS installed. Install [here](https://nodejs.org/en/)
- Clone the repo. `git clone https://github.com/CaiusAjiz/TimeSince.git`
- `npm install` for dependencies
- Rename/copy `example.config.json` to `config.json` and fill it in. 

### Running the bot
`node index.js` and `ctrl` + `c` to quit

## Folder structure

### `bot-infra` 
Things that need to happen before the bot has signed into Discord, like 
folder prep and command deployment go here.

### `commands`
These are slash commands that users interact with. 

### `data`
Folder that creates on first run. Storage location for the bot once 
it's running. 

timers.json stores each timer as an object, with 4 values
```
{
    "name": "String",
    "created": UnixTimeStamp,
    "lastReset": UnixTimeStamp,
    "timesReset": int
}
```
### `events`
Things the bot does once signed into Discord, but aren't direct user
interactions. 
