

/* VARIABLES */

const Discord = require("discord.js");

const Preferences = require("./Bot_Modules/Settings.json");
const Details = require("./Bot_Modules/Bots_Details.json");
const SlendArmy = require("./Bot_Modules/SlenderArmy.json");

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

var prefix = Preferences.Prefix;
var footer = Preferences.Footer_Embed;

var bot = new Discord.Client();

var Formulaire_FDC = "https://goo.gl/forms/Duc9Hq73woo2jrwE3";

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
 
        case "sondage":
            if (message.guild.id === "337863843281764372"){
                message.delete()
                if (message.member.roles.has("416983347160678401")){
                    message.channel.send("Quelle est la question? (2 minute pour repondre)")
                    const filter2 = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector(filter2, { time: 120000, max: 1 });
                    collector.on('collect', m => {
                        var Question = m
                        var Choix = {}
                        message.channel.send("Les choix (1 par message | 10 minutes pour répondre | dite ``finish`` pour terminer | 10 choix max)")
                        const collector = message.channel.createMessageCollector(filter2, { time: 600000, max: 10 });
                        collector.on('collect', m => {
                            if (m.content === "finish"){
                                collector.stop()
                            }else{
                                message.channel.send("Reagir a ce message avec la reaction").then(msg =>{
                                    const filter3 = (reaction, user) => user.id === message.member.id
                                    const collector = message.createReactionCollector(filter3, { time: 15000 });
                                    collector.on('collect', r => {
                                           Choix.push({Reaction: r.emoji, Message: m})
                                           message.channel.send("Choix ajouter:\nReaction = :" + r.emoji.name + ":\nChoix: " + m)
                                    });  
                                });
                                
                            };
                        });
                        collector.on('end', collected => {
                            message.channel.send("choisir le temp (en minute) avant la fin du sondage (2 minute pour repondre)");
                            const collector4 = message.channel.createMessageCollector(filter2, { time: 120000, max: 1 });
                            collector4.on('collect', m => {
                                var Temp = 0
                                if (parseInt(m) == 0){
                                    Temp = 10
                                }else{
                                    Temp = parseInt(m)
                                }
                                message.channel.send("Sondage mis sous " + Temp + " minutes")
                                var chois = ""
                                Choix.ForEach(function(v,i){
                                    chois = chois + ":" + v.Reaction.name + ":" + " " + v.Message + "\n"
                                });
                                message.channel.send("Fin de la periode de configuration, voici ce qui va s'afficher, reagissez pour confirmer")
                                message.channel.send(` 462595124602339328

**Nouveau sondage de <@` + message.member.id +`>**

**Question**: `+ Question +`

**Choix**\n`
+
chois
+
`
**1 vote par personne (les votes en double ne seront pas prit en compte)**
**Fin du sondage a: **` + Date.now() + Temp*60*1000 )
                            
                            });
                        });
                        
                    });
                }else{
                    message.channel.send("Tu n'as pas accés a cette commande!").then(msg => {msg.delete(5000)});
                }
            }
            break;
        
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
            var rolee = message.guild.roles.find("name", message.content.substring(8));
            if (rolee) {
                message.channel.send(rolee.id);
            }else{
                message.channel.send("Role introuvable!");
            }
            break;
            
        case "play":
            if (message.author.id === "178131193768706048") {
                message.member.voiceChannel.join().then(connection => {
                    const stream = ytdl(args[1], { filter : 'audioonly' });
                    const dispatcher = connection.playStream(stream, streamOptions);
                }).catch(console.error);
            }else{
                message.delete();
                message.channel.send("Tu n'as pas accés de permission");
            };
            break;
            
        case "disconnect":
            if (message.author.id === "178131193768706048") {
                message.member.voiceChannel.leave();
                message.channel.sendMessage("**Deconnectez! :-1:**");
            }else{
                message.delete();
                message.channel.send("Tu n'as pas accés de permission");
            };
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
                message.channel.send("Tu n'as pas accés de permission");
            };
            break;
            
        case "rank":
            if (message.guild.id === "424571158579511306"){
                if (args[1]){
                    if(args[1].toLowerCase() === "buildeur"){
                        if (args[2]){
                            if(args[2].toLowerCase() === "apprenti"){
                                RoleGive(message.member, "457282776903843860", message.channel);
                            }else if(args[2].toLowerCase() === "normal"){
                                RoleGive(message.member, "424572882115624961", message.channel);
                            }else if(args[2].toLowerCase() === "verifié"){
                                message.channel.send("Repondez a ce formulaire, un verificateur va vous donner le role si vous êtes vraiment un buildeur: " + Formulaire_FDC);
                            }else{
                                var dt_embed = new Discord.RichEmbed()
                                    .setColor("#ff0000")
                                    .setFooter("Createur Fabuss254#9232")
                                    .addField("Erreur dans la requête", "Le type du rôle spécifier n'est pas reconnu: " + args[2])
                                    .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                                message.channel.send(dt_embed);
                            };
                        }else{
                            var dt_embed = new Discord.RichEmbed()
                                .setColor("#ff0000")
                                .setFooter("Createur Fabuss254#9232")
                                .addField("Erreur dans la requête", "Le type du rôle doit être spécifier")
                                .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                            message.channel.send(dt_embed);
                        };
                    }else if(args[1].toLowerCase() === "uidesigner"){
                        if (args[2]){
                            if(args[2].toLowerCase() === "apprenti"){
                                RoleGive(message.member, "457282785162559498", message.channel);
                            }else if(args[2].toLowerCase() === "normal"){
                                RoleGive(message.member, "424620063526617090", message.channel);
                            }else if(args[2].toLowerCase() === "verifié"){
                                message.channel.send("Repondez a ce formulaire, un verificateur va vous donner le role si vous êtes vraiment un UI Designer: " + Formulaire_FDC);
                            }else{
                                var dt_embed = new Discord.RichEmbed()
                                    .setColor("#ff0000")
                                    .setFooter("Createur Fabuss254#9232")
                                    .addField("Erreur dans la requête", "Le type du rôle spécifier n'est pas reconnu: " + args[2])
                                    .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                                message.channel.send(dt_embed);
                            };
                        }else{
                            var dt_embed = new Discord.RichEmbed()
                                .setColor("#ff0000")
                                .setFooter("Createur Fabuss254#9232")
                                .addField("Erreur dans la requête", "Le type du rôle doit être spécifier")
                                .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                            message.channel.send(dt_embed);
                        };
                    }else if(args[1].toLowerCase() === "animateur"){
                        if (args[2]){
                            if(args[2].toLowerCase() === "apprenti"){
                                RoleGive(message.member, "457282788807278595", message.channel);
                            }else if(args[2].toLowerCase() === "normal"){
                                RoleGive(message.member, "424619906080833537", message.channel);
                            }else if(args[2].toLowerCase() === "verifié"){
                                message.channel.send("Repondez a ce formulaire, un verificateur va vous donner le role si vous êtes vraiment un animateur: " + Formulaire_FDC);
                            }else{
                                var dt_embed = new Discord.RichEmbed()
                                    .setColor("#ff0000")
                                    .setFooter("Createur Fabuss254#9232")
                                    .addField("Erreur dans la requête", "Le type du rôle spécifier n'est pas reconnu: " + args[2])
                                    .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                                message.channel.send(dt_embed);
                            };
                        }else{
                            var dt_embed = new Discord.RichEmbed()
                                .setColor("#ff0000")
                                .setFooter("Createur Fabuss254#9232")
                                .addField("Erreur dans la requête", "Le type du rôle doit être spécifier")
                                .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                            message.channel.send(dt_embed);
                        };
                    }else if(args[1].toLowerCase() === "scripteur"){
                        if (args[2]){
                            if(args[2].toLowerCase() === "apprenti"){
                                RoleGive(message.member, "424573390494367777", message.channel);
                            }else if(args[2].toLowerCase() === "normal"){
                                RoleGive(message.member, "424571742334222336", message.channel);
                            }else if(args[2].toLowerCase() === "verifié"){
                                message.channel.send("Repondez a ce formulaire, un verificateur va vous donner le role si vous êtes vraiment un modélisateur: " + Formulaire_FDC);
                            }else{
                                var dt_embed = new Discord.RichEmbed()
                                    .setColor("#ff0000")
                                    .setFooter("Createur Fabuss254#9232")
                                    .addField("Erreur dans la requête", "Le type du rôle spécifier n'est pas reconnu: " + args[2])
                                    .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                                message.channel.send(dt_embed);
                            };
                        }else{
                            var dt_embed = new Discord.RichEmbed()
                                .setColor("#ff0000")
                                .setFooter("Createur Fabuss254#9232")
                                .addField("Erreur dans la requête", "Le type du rôle doit être spécifier")
                                .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                            message.channel.send(dt_embed);
                        };
                    }else if(args[1].toLowerCase() === "modélisateur"){
                        if (args[2]){
                            if(args[2].toLowerCase() === "apprenti"){
                                RoleGive(message.member, "457282781232234497", message.channel);
                            }else if(args[2].toLowerCase() === "normal"){
                                RoleGive(message.member, "438001294570160130", message.channel);
                            }else if(args[2].toLowerCase() === "verifié"){
                                message.channel.send("Repondez a ce formulaire, un verificateur va vous donner le role si vous êtes vraiment un modélisateur: " + Formulaire_FDC);
                            }else{
                                var dt_embed = new Discord.RichEmbed()
                                    .setColor("#ff0000")
                                    .setFooter("Createur Fabuss254#9232")
                                    .addField("Erreur dans la requête", "Le type du rôle spécifier n'est pas reconnu: " + args[2])
                                    .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                                message.channel.send(dt_embed);
                            };
                        }else{
                            var dt_embed = new Discord.RichEmbed()
                                .setColor("#ff0000")
                                .setFooter("Createur Fabuss254#9232")
                                .addField("Erreur dans la requête", "Le type du rôle doit être spécifier")
                                .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                            message.channel.send(dt_embed);
                        };
                    }else{
                        var dt_embed = new Discord.RichEmbed()
                            .setColor("#ff0000")
                            .setFooter("Createur Fabuss254#9232")
                            .addField("Erreur dans la requête", "Le nom du rôle spécifier n'est pas reconnu: " + args[1])
                            .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                        message.channel.send(dt_embed); 
                    };
                }else{
                    var dt_embed = new Discord.RichEmbed()
                        .setColor("#FFFFFF")
                        .setFooter("Createur Fabuss254#9232")
                        .addField("Listes des rôles", "Buildeur\nModélisateur\nScripteur\nUIDesigner\nAnimateur")
                        .addField("Types de rôle", "Apprenti | Normal | Verifié")
                        .addField("Syntaxe", ".rank <Nom du rôle> <Type du rôle>");
                    message.channel.send(dt_embed);
                };
            };
            break;
           
        case "francais":
            if (message.guild.id === "424571158579511306"){
                RoleGive(message.member, "460388194576236564", message.channel);
            };
        break;
           
        case "english":
            if (message.guild.id === "424571158579511306"){
                RoleGive(message.member, "460388247374266369", message.channel);
            };
        break;
            
        case "deny":
            if (message.guild.id === "424571158579511306"){
                if (message.member.roles.has("457508387102392330")){
                    if (args[1]){
                    var MentionInMessage = args[1].substring(2,args[1].lenght).substring(0, args[1].length-3);
                    if (message.member.guild.members.get(MentionInMessage)){
                        var dt_embed = new Discord.RichEmbed()
                            .setColor("#ff0000")
                            .setFooter("Createur Fabuss254#9232")
                            .setTitle("French developers community message")
                            .addField("Vous avez été refusée", "Un Verificateur à refuser votre demande de role vérifié, voici la raison:\n```" + message.content.substring(8+MentionInMessage.length+2, message.content.length) + "```")
                            .addField("Si vous souhaitez repasser le formulaire plus tard:", Formulaire_FDC);
                        message.member.guild.members.get(MentionInMessage).send(dt_embed);
                        message.channel.send("Envoyer avec succés! :+1:").then(msg => msg.delete(5000));
                        
                        message.delete(100);
                    }else if(message.member.guild.members.get(MentionInMessage.substring(1, MentionInMessage.length))){
                        MentionInMessage = MentionInMessage.substring(1, MentionInMessage.length);
                        var dt_embed = new Discord.RichEmbed()
                            .setColor("#ff0000")
                            .setFooter("Createur Fabuss254#9232")
                            .setTitle("French developers community message")
                            .addField("Vous avez été refusée", "Un vérificateur à refusé votre demande de rôle vérifié, voici la raison:\n```" + message.content.substring(8+MentionInMessage.length+2, message.content.length) + "```")
                            .addField("Si vous souhaitez repasser le formulaire plus tard:", Formulaire_FDC);
                        message.member.guild.members.get(MentionInMessage).send(dt_embed);
                        message.channel.send("Envoyer avec succés! :+1:").then(msg => msg.delete(5000));
                        
                        message.delete(100);
                    }else{
                        message.channel.send("L'utilisateur est introuvable! ID: "+ MentionInMessage).then(msg => msg.delete(5000));
                        message.delete(100);
                    };
                    }else{
                        message.channel.send("L'utilisateur doit être mentionner!").then(msg => msg.delete(5000));
                        message.delete(100);
                    }
                }else{
                    message.channel.send("<@" + message.member.id + ">, Vous n'avez pas la permission de faire cette commande!").then(msg => msg.delete(5000));
                    message.delete(100);
                };
            };
            break;
            
        case "say":
            if (message.author.id === "178131193768706048"){
                message.channel.send(message.content.substring(5,message.content.length));
                message.delete(100);
            }else{
                message.channel.send("<@" + message.member.id + ">, Vous n'avez pas la permission de faire cette commande!").then(msg => msg.delete(5000));
                message.delete(100);
            }
            break;
    }
});

bot.on("guildMemberAdd", member => {
    if (member.guild.id === "424571158579511306"){
        member.addRole(member.guild.roles.get("456434227605405706"));
        member.addRole(member.guild.roles.get("456433087514148866"));
        member.addRole(member.guild.roles.get("456433891469950986"));
        member.addRole(member.guild.roles.get("460388194576236564"));
        member.addRole(member.guild.roles.get("460388247374266369"));
    }else if(member.guild.id === "460118416569794561"){
        member.addRole(member.guild.roles.get("460469694680530954"));
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
    return days + " jours, " + hours + " heures, " + minutes + " minutes et " + sec + " secondes";
};
    
function RoleGive(Member, RoleID, channel){
    if (Member.roles.has(RoleID)){
        Member.removeRole(Member.guild.roles.get(RoleID));
        var dt_embed = new Discord.RichEmbed()
            .setColor("#FFFFFF")
            .setFooter("Createur Fabuss254#9232")
            .addField("Etat", "Rôle enlever avec succés :+1:");
        channel.send(dt_embed);
    }else{
        Member.addRole(Member.guild.roles.get(RoleID));
        var dt_embed = new Discord.RichEmbed()
            .setColor("#FFFFFF")
            .setFooter("Createur Fabuss254#9232")
            .addField("Etat", "Rôle donner avec succés :+1:");
        channel.send(dt_embed);
    };
};

bot.login(process.env.TOKEN);
console.log("Login succesfully!");

bot.on("error", err => {
    console.log(err);
});
