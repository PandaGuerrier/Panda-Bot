const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute une personne !')
    .addUserOption(option => option.setName('ping').setDescription('Le membre a unmute !').setRequired(true)),
    role: ["959209557719126087", "959209559803711498", "959209560718065704"],


	async execute(client, interaction) {

        const mem = interaction.options.getMember("ping")

        const dja = new Discord.MessageEmbed()
        .setTitle("Pas mute")
        .setDescription(`${mem} n'est pas mute , tu ne peux pas le unmute !`)
        .setColor(config.embedColor)

      if(interaction.member.user.id == mem.user.id) return interaction.reply({content: `Tu ne peux pas te unmute toi m\u00eame !`, ephemeral: true}) 

      const emb = new Discord.MessageEmbed()
        .setTitle("Vous avez \u00e9t\u00e9 unmute de " + config.informations.nom + " !")
        .setDescription("Veuillez à ne pas recommencer la prochaine fois ) !")
        .setColor(config.embedColor)   


        const emb1 = new Discord.MessageEmbed()
        .setTitle("Succ\u00e8s !")
        .setDescription(`Vous avez bien unmute : ${mem}`)
        .setColor(config.embedColor)   
        
        mem.send({embeds: [emb]}).catch()
        interaction.reply({embeds: [emb1], ephemeral: true})

        const log = new Discord.MessageEmbed()
        .setDescription(interaction.member.user.tag + " a unmute " + mem.user.tag)
        .setColor("#FF0000")

        interaction.guild.channels.cache.get(config.channels.log).send({embeds: [log]})
         mem.timeout(null, "unmuted")
  }
}