

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
    bot.setInterval(SondageGiv, 60000);
});

bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;
    var args = message.content.substring(prefix.length).split (" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
 
        case "clearbot":
            if (message.author.id === "178131193768706048") {
                var Mem = message.guild.members
                var Found = []
                Mem.forEach(function(v,i){
                    if (!v.lastMessage && v.joinedTimestamp > Date.now() - 60*60000 && v.presence.status == "offline"){
                        Found.push(Mem.id);
                    };
                });
                
                Found.forEach(function(v,i){
                    message.channel.send("<@" + v + ">")
                });
                
                message.channel.send("Trouver " + Found.length + " Potentiel fake users")
            }else{
                message.delete();
                message.channel.send("Tu n'as pas accés a cette commande");
            };
            break;
            
        case "sondage":
            if (message.guild.id === "337863843281764372"){
                message.delete()
                if (message.member.roles.has("416983347160678401")){
                    message.channel.send("Quelle est la question? (2 minute pour repondre sinon annulation)")
                    const filter2 = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector(filter2, { maxMatches: 1 });
                    collector.on('collect', m => {
                        var Question = m
                        var Choix = []
                        message.channel.send("Les choix (1 par message | dite ``finish`` pour terminer | 10 choix max)")
                        const collector = message.channel.createMessageCollector(filter2, {maxMatches: 10});
                        collector.on('collect', m => {
                            if (m.content === "finish"){
                                collector.stop()
                            }else{
                                message.channel.send("Reagir a ce message avec la reaction").then(msg =>{
                                    const filter3 = (reaction, user) => user.id === message.member.id
                                    const collector = msg.createReactionCollector(filter3);
                                    collector.on('collect', r => {
                                            var exist = false;
                                            Choix.forEach(function(v,i){
                                                if (v.Reaction === r.emoji){
                                                    exist = true;
                                                };
                                            });
                                            if (exist === true){
                                                message.channel.send("ERREUR: Emoji similaire deja utiliser! | Merci de mettre une autre reaction!").then(gd => gd.delete(5000));
                                            }else{
                                                Choix.push({Reaction: r.emoji, Message: m});
                                                if (r.emoji.id){
                                                    message.channel.send("Choix ajouter:\n \nReaction = " + bot.emojis.get(r.emoji.id).toString() + "\nChoix = " + m + "\nEmoji custom");
                                                }else{
                                                    message.channel.send("Choix ajouter:\n \nReaction = " + r.emoji.toString() + "\nChoix = " + m + "\nEmoji normal");
                                                };
                                                collector.stop();
                                                msg.delete();
                                            }
                                    });  
                                });
                                
                            };
                        });
                        collector.on('end', collected => {
                            message.channel.send("choisir le temp (en minute) avant la fin du sondage (Max: ``Null``)");
                            const collector4 = message.channel.createMessageCollector(filter2, { maxMatches: 1 });
                            collector4.on('collect', m => {
                                var Temp = 0
                                collector4.stop();
                                if (parseInt(m) == 0){
                                    Temp = 10
                                }else{
                                    Temp = parseInt(m)
                                }
                                message.channel.send("Sondage mis sous " + Temp + " minutes")
                                var chois = ""
                                Choix.forEach(function(v,i){
                                    if (v.Reaction.id){
                                        chois = chois + bot.emojis.get(v.Reaction.id).toString() + " " + v.Message + "\n"
                                    }else{
                                        chois = chois + v.Reaction.toString() + " " + v.Message + "\n"
                                    };
                                });
                                var MessageEnd = ""
                                Choix.forEach(function(v,i){
                                    if (v.Reaction.id){
                                        MessageEnd = MessageEnd + "|←" + v.Message + "|C" + v.Reaction.id
                                    }else{
                                        MessageEnd = MessageEnd + "|←" + v.Message + "|N" + v.Reaction.toString()
                                    }
                                    
                                });
                                message.channel.send("Fin de la periode de configuration, voici ce qui va s'afficher, reagissez pour confirmer")
                                var MessageToSend = `**Nouveau sondage de ` + message.author.username  + `**
Question: `+ Question +`

__**Choix**__\n`
+
chois
+
`

Fin du sondage: **` + Temp + ` min**`;
                                    message.channel.send(MessageToSend).then(msg => {
                                    const filter3 = (reaction, user) => user.id === message.member.id
                                    const collector = msg.createReactionCollector(filter3);
                                    collector.on('collect', r => {
                                           if (r.emoji.toString() === "✅"){
                                               collector.stop();
                                               message.channel.send("Sondage envoyer!");
                                               msg.delete();
                                               message.guild.channels.get("462996913290215424").send(MessageToSend).then(msg => {
                                                   message.guild.channels.get("463018996652834826").send((Date.now() + Temp*60000) + "|" + msg.id + "|" + Question + MessageEnd)
                                                   message.guild.channels.get("462996913290215424").send("Nouveau sondage de " + message.author.username + " \nQuestion: **" + Question + "**\n <@&416983347160678401>").then(f => f.delete(100));
                                                   Choix.forEach(function(v,i){
                                                       if (v.Reaction.id){
                                                           msg.react(bot.emojis.get(v.Reaction.id));
                                                       }else{
                                                           msg.react(v.Reaction.toString());
                                                       };
                                                   });
                                               });
                                           }else if(r.emoji.toString() === "❎"){
                                               collector.stop();
                                               message.channel.send("Sondage annuler!");
                                               msg.delete();
                                           };
                                    }); 
                                    collector.on('end', r => {
                                        msg.delete();
                                    });
                                    
                                    msg.react("✅");
                                    msg.react("❎");
                                });
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

function msToTime(s) {
  var pad = (n, z = 2) => ('00' + n).slice(-z);
  return pad(s/3.6e6|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0) + '.' + pad(s%1000, 3);
}
    
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

function SondageGiv(){
    var RemainingSond = bot.guilds.get("337863843281764372").channels.get("463018996652834826");
    var SondageChannel = bot.guilds.get("337863843281764372").channels.get("462996913290215424");
    RemainingSond.fetchMessages().then(messages => {
        messages.forEach(function(v,i){
            var args = v.content.split("|");
            SondageChannel.fetchMessages().then(msgs => {
                if (msgs.get(args[1])){
                    var gg = msgs.get(args[1]).content.split(" ");
                    var Str = ""
                    var IsFinished = false;
                    gg.forEach(function(v,i){
                        if (gg[i+1] === "min**"){
                            var y = Math.floor((args[0] - Date.now())/60000)
                            Str = Str + " **" + y
                            if (y < 1){
                                IsFinished = true;
                            }
                        }else{
                            Str = Str + " " + v
                        };
                    });
                    if (IsFinished === true){
                        var MsgId = args[1];
                        var Ques = args[2];
                        var MD = []
                        args.forEach(function(v,i){
                            if (args[i].startsWith("←")){
                                if (args[i+1].startsWith("C")){
                                    MD.push({Reaction: bot.emojis.get(args[i+1].substring(1)).toString(), Message: args[i].substring(1)});
                                }else{
                                    MD.push({Reaction: args[i+1].substring(1), Message: args[i].substring(1)});
                                };
                            };
                        });
                        var emojisMsg = msgs.get(MsgId).reactions
                        
                        var Results = ""
                        
                        emojisMsg.forEach(function(v,i){
                            MD.forEach(function(v2,i2){
                                if (v.emoji.toString() == v2.Reaction){
                                    Results = Results + "\n" + v2.Reaction + " " + v2.Message + " = " + (v.count - 1)
                                }
                            });
                        });
                        msgs.get(MsgId).delete();
                        bot.guilds.get("337863843281764372").channels.get("462996913290215424").send(`
**Resultat a la question**: ` + Ques + `
` + Results + `

**Merci d'avoir participer!**
`); 
                        v.delete();
                    }else{
                        msgs.get(args[1]).edit(Str); 
                    };
                    
                }
            });
        });
    });
}

bot.login(process.env.TOKEN);
console.log("Login succesfully!");

bot.on("error", err => {
    console.log(err);
});
