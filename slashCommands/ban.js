const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban un membre')
    .addUserOption(option => option.setName('membre').setDescription('Le membre a ban').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('La raison du ban').setRequired(true)),

  async execute(interaction) {

    const mem = interaction.options.getUser("membre")
    const EmbedDescription = interaction.options.getString("raison")

    if (interaction.member.user.id == mem) return interaction.reply({ content: `Tu ne peux pas te ban toi m\u00eame !`, ephemeral: true })

    const emb = new MessageEmbed()
      .setTitle("Vous avez \u00e9t\u00e9 banni de " + config.informations.serverName + " !")
      .addFields(
        { name: "Banni par : ", value: interaction.member.user.username, inline: true },
        { name: "Raison :", value: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"), inline: true }
      )
      .setColor("#FF0000")


    const emb1 = new MessageEmbed()
      .setTitle("Succ\u00e8s !")
      .setDescription("Vous avez bien banni : " + mem.tag)
      .addFields(
        { name: "Raison :", value: String(EmbedDescription).substr(0, 2048).split("+n+").join("\n") }
      )
      .setColor(config.embedColor)

    mem.send({ embeds: [emb] }).catch((e) => {

    })
    interaction.reply({ embeds: [emb1], ephemeral: true })

    const log = new MessageEmbed()
      .setDescription(interaction.member.user.tag + " a banni " + mem.tag + " pour la raison : " + String(EmbedDescription))
      .setColor("#FF0000")

    interaction.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })
    interaction.guild.members.ban(mem.id, { reason: EmbedDescription }).catch((error) => { })
  }
}