var Settings = {
    "Token":"Bot_Token",
    "Prefix":"Bot_Prefix",
    "AboneRolİD":"Abone_Rol_İD",
    "AboneYetkisi":"Abone_Yetkilisi_İD"
}

var Discord = require('discord.js')
var Client = new Discord.Client({
    fetchAllMembers:true,
    restTimeOffset:750
})
var Nukleon = require('nukleon')
var Database = new Nukleon.Database("Database.json")

/*
    QuickDB kullanmak isterseniz;
        var Nukleon = require('nukleon')
        var Database = new Nukleon.Database("Database.json")
        kısmını silin ve şu şekilde değiştirin.
        var Database = require('quick.db')
*/

Client.on("ready",async()=>{
    Client.user.setPresence({
        activity:{
            name:"Onurege was here.",
            type:"WATCHING"
    }
    })
    console.log("Bot Aktif!")
})

Client.on("message",async(message)=>{
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(Settings.Prefix) !== 0) return;

    const args = message.content.slice(Settings.Prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();


    if(["abone","a"].includes(cmd)){
        if(!message.member.roles.cache.has(Settings.AboneYetkisi) && !message.member.hasPermission("MANAGE_ROLES")) return message.react("❌")
        var Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!Member) return message.react("❌")
        Member.roles.add(Settings.AboneRolİD)
        message.react("✅")
        Database.push(`${message.guild.id}.${Member.user.id}`,`<@!${message.author.id}> tarafından verilmiş`)
    }
    if(cmd === "i"){
        if(!message.member.roles.cache.has(Settings.AboneYetkisi) && !message.member.hasPermission("MANAGE_ROLES")) return message.react("❌")
        var Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!Member) return message.react("❌")
        var RoleData = Database.get(`${message.guild.id}.${Member.user.id}`)
        RoleData = RoleData.reverse().slice(0,10)

        message.channel.send({
            embed:{
            description:`${Member} kullanıcısnının abone rol verileri: \n\n${RoleData.join("\n")}`,
            timestamp:Date.now()
        }})
    }
})

Client.on("guildMemberRemove",async(Member)=>{
    var Guild = Member.guild
    Database.push(`${Guild.id}.${Member.id}`,"Sunucudan Ayrılma")
})

Client.login(Settings.Token)
