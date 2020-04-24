// Load up the discord.js library
const Discord = require("discord.js");
const fs = require("fs")

const botResponse = require("./response.js");
const botManage = require("./manage.js");
const botManageRules = require("./manageRules.js");
const botAddNewRule = require("./addnewrule.js");


/********************************************** start code **********************************************/

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Update successful!`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Fox News`);
});

client.on("message", async message => {
// This event will run on every single message received, from any channel or DM.
  
    if(message.author.bot) return;

    if(fs.existsSync("./" + message.author.id + "user.json") && message.content.indexOf(config.command) !== 0){
        let addjson = JSON.parse(fs.readFileSync("./" + message.author.id + "user.json"))
        if (Date.now()-addjson["timestamp"] > 60000){
            fs.unlinkSync("./" + message.author.id + "user.json")
        }
        else if (message.content === "quit"){
            message.channel.send("Quit Adding Command")
            fs.unlinkSync("./" + message.author.id + "user.json")
            return
        }
        else {
            if (addjson["channel"] == message.channel.id){
                botAddNewRule.addNewRule(client, message)
                return
            }
        }
    }

    if (message.content.indexOf(config.prefix) === 0){
        // Here we separate our "command" name, and our "arguments" for the command. 
        // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
        // command = say
        // args = ["Is", "this", "the", "real", "life?"]
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
        
        botManage.execManage(client, message, args, command);
    }
    else if (message.content.indexOf(config.command) === 0){
        botManageRules.manageRules(client, message)
    }
    else {
        botResponse.botMessage(client, message)
    }

});

client.on("voiceStateUpdate", (oldState, newState) => {
    // This event triggers when a user enters or leave the voice channel.

    if(oldState.member.id === "699813891982622720") return;

    botResponse.botVoice(client, oldState, newState);  
  
});

client.login(config.token);
