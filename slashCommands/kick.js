const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick un membre')
		.addUserOption(option => option.setName('membre').setDescription('Le membre a ban').setRequired(true))
		.addStringOption(option => option.setName('raison').setDescription('La raison du ban').setRequired(true)),
    role: ["959209557719126087", "959209559803711498", "959209560718065704"],


	async execute(client, interaction) {

        const mem = interaction.options.getUser("membre")
        const EmbedDescription = interaction.options.getString("raison") 

        if(interaction.member.user.id == mem) return interaction.reply({content: `Tu ne peux pas te kick toi m\u00eame !`, ephemeral: true}) 

        const emb = new Discord.MessageEmbed()
          .setTitle("Vous avez \u00e9t\u00e9 kick de " + config.informations.nom + " !")
          .addFields(
            {name: "Kick par : ", value: interaction.member.user.username, inline: true},
            {name: "Raison :", value: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"), inline: true}
          )
          .setColor("#FF0000")   
  
  
          const emb1 = new Discord.MessageEmbed()
          .setTitle("Succ\u00e8s !")
          .setDescription("Vous avez bien kick : " + mem.tag)
          .addFields(
            {name: "Raison :", value: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n")}
          )
          .setColor(config.embedColor)   
          
          mem.send({embeds: [emb]}).catch((e) => {
  
          })
          interaction.reply({embeds: [emb1], ephemeral: true})
  
          const log = new Discord.MessageEmbed()
          .setDescription(interaction.member.user.tag + " a kick " + mem.tag + " pour la raison : " + String(EmbedDescription))
          .setColor("#FF0000")
  
          interaction.guild.channels.cache.get(config.channels.log).send({embeds: [log]})
          interaction.guild.members.kick(mem.id, { reason: EmbedDescription }).catch((error) => { })
  }
}