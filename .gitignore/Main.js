

/* VARIABLES */

const Discord = require("discord.js");

const Preferences = require("./Bot_Modules/Settings.json");
const Details = require("./Bot_Modules/Bots_Details.json");
var prefix = Preferences.Prefix;
var footer = Preferences.Footer_Embed;

var bot = new Discord.Client();

/* EVENEMENT */

bot.on("ready", ()=> {
    var GuildTable = bot.guilds.array();
    var TotalUser = 0;
    var AvailableGuild = 0;
    console.log("]----[UNAVAILABLE SERVER LIST]----[")
    for (i=0; i < GuildTable.length; i++) {
        if (GuildTable[i].available) {
            AvailableGuild = AvailableGuild + 1;
            TotalUser = TotalUser + GuildTable[i].memberCount;
        }else{
            console("Unavailable guild detected: " + GuildTable[i].name );
        };
    };
    console.log("]----[STATS]----[")
    console.log("Total guilds: " + bot.guilds.array().length);
    console.log("Available guilds: " + AvailableGuild);
    console.log("Total user: " + TotalUser );
    console.log("]----[END]----[")
    console.log("Bot ready to be use!");
    bot.user.setPresence({game:{name: prefix + "help | serveurs: " + AvailableGuild + " | Membres: " + TotalUser, url: "https://www.twitch.tv/fabuss255", type: 1}});
});

bot.login(process.env.TOKEN);
console.log("Login succesfully!");

bot.on("error", err => {
    console.log(err);
});
