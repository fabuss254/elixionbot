

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
    
    var start_embed = new Discord.RichEmbed()
        .setColor("#FFFFFF")
        .setTitle("Bot started!")
        .addField("Total guilds", bot.guilds.array().length)
        .addField("Available guilds", AvailableGuild)
        .addField("Total membres: ", TotalUser);
    bot.users.get("178131193768706048").send(start_embed);
    bot.user.setPresence({game:{name: prefix + "help | serveurs: " + AvailableGuild + " | Membres: " + TotalUser, url: "https://www.twitch.tv/fabuss255", type: 1}});
});

bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;
    var args = message.content.substring(prefix.length).split (" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
 
        case "help":
            message.delete();
            var help_embed = new Discord.RichEmbed()
                .setColor("#FFFFFF")
                .addField(prefix + "help", "Affiche la liste des commandes disponibles.")
                .addField(prefix + "botinfo", "Affiche les statistiques du bot.");
            message.channel.send(help_embed);
            break;
        
        case "botinfo":
            message.delete();
            var dt_embed = new Discord.RichEmbed()
                .setColor("#FFFFFF")
                .addField("Createur: ", "fabuss254#9232")
                .addField("Prefix: ", prefix)
                .addField("Uptime: ", dhm(bot.uptime));
            message.channel.send(dt_embed);
            break;
            
        case "roleid":
            var rolee = message.author.guild.roles.find("name",args[1])
            if (rolee) {
                message.channel.send(rolee.id);
            }else{
                message.channel.send("Role introuvable!");
            }
            break;
         
        case "getguilds":
            if (message.author.id === "178131193768706048") {
                message.delete();
                var GuildTable = bot.guilds.array();
                for (i=0; i < GuildTable.length; i++) {
                    if (GuildTable[i].available) {
                        console.log(GuildTable[i].name + ":" + GuildTable[i].id + " | " + GuildTable[i].owner + ":" + GuildTable[i].ownerID);
                    };
                };
                message.channel.send("Printed in console!");
            }else{
                message.delete();
                message.channel.send("Not enought permissions");
            };
            break;  
    }
});

bot.on("guildMemberAdd", member => {
    if (member.equals(bot.user)) return;
    if (member.guild.id === 424571158579511306){
        member.addRole(member.guild.roles.find("name","■▬▬▬▬► Membres ◄▬▬▬▬■"));
        member.addRole(member.guild.roles.find("name","■▬▬▬► Experience ◄▬▬▬■"));
        member.addRole(member.guild.roles.find("name","■▬▬▬▬► Statue ◄▬▬▬▬■"));
    };
});

function dhm(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));    
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000)) 
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    
    if (sec.length === 1){
        sec = "0" + sec;
    };
    if (days.length === 1){
        days = "0" + days;
    };
    if (hours.length === 1){
        hours = "0" + hours;
    };
    if (minutes.length === 1){
        minutes = "0" + minutes;
    };
    return days + ":" + hours + ":" + minutes + ":" + sec;
}

bot.login(process.env.TOKEN);
console.log("Login succesfully!");

bot.on("error", err => {
    console.log(err);
});
