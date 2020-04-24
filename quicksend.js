// Load up the discord.js library
const Discord = require("discord.js");

var fs = require('fs');
var dev = "700028814402650262";
var tdsID = "131087537165959168";

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Update successful!");
  const channel = client.channels.cache.get(tdsID);

  //channel.send("").then(() => client.destroy());
  //channel.send("", {files: [""]}).then(() => client.destroy());
});

client.on("message", async (message) => {

    if(message.author.bot) return;

    const embed = new Discord.MessageEmbed()
        .setTitle('A slick little embed')
        .setColor(0xff0000)
        .setDescription('Hello, this is a slick embed!')
    message.channel.send(embed);
});


client.login("NzAxNzk1NTM0MTAwMjM0MzQw.Xp9haw.hOE7_5sIyoL91Tm3dno2qsm-CiQ");  //bot testing server
//client.login("Njk5ODEzODkxOTgyNjIyNzIw.Xp9hSA.Fukw0RIQZT63BAG8m3fMuNeqvZY");  //Donaldinho
