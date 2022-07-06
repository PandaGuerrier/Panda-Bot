const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const ms = require("ms")
const { tempsRestant } = require("../utils/functions.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempsmute')
    .setDescription('Mute une personne temporairement !')
    .addUserOption(option => option.setName('ping').setDescription('Le membre a mute').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('La raison du mute').setRequired(true))
    .addIntegerOption(option => option.setName('jours').setDescription('Le nombre de jours a mute').setRequired(true))
    .addIntegerOption(option => option.setName('heures').setDescription("Le nombre d'heures a mute").setRequired(true))
    .addIntegerOption(option => option.setName('minutes').setDescription('Le nombre de minutes a mute').setRequired(true)),

  async execute(interaction) {
    const member = interaction.options.getMember("ping")
    const reason = interaction.options.getString("raison")
    const d = interaction.options.getInteger("jours")
    const h = interaction.options.getInteger("heures")
    const m = interaction.options.getInteger("minutes")

    if (interaction.member.user.id == member.user.id) return interaction.reply({ content: `Tu ne peux pas te mute toi m\u00eame !`, ephemeral: true })

    if (member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "Je ne peux pas mute cette personne :/ !", ephemeral: true })

    const embedSendMuted = new MessageEmbed()
      .setDescription("Vous avez \u00e9t\u00e9 mute de " + config.informations.serverName + " !")
      .addFields(
        { name: "Mute par : ", value: interaction.member.user.username, inline: true },
        { name: "Raison :", value: String(reason), inline: true }
      ).setColor(config.embedColor)


    const embedSenStaff = new MessageEmbed()
      .setDescription(`Vous avez bien mute : ${member}`)
      .addFields(
        { name: "Sera unmute dans :", value: "<t:" + tempsRestant(d, h, m) + ":R>" },
        { name: "Raison :", value: String(reason) }
      ).setColor(config.embedColor)

    member.send({ embeds: [embedSendMuted] }).catch()
    interaction.reply({ embeds: [embedSenStaff], ephemeral: true })

    const log = new MessageEmbed()
      .setDescription(interaction.member.user.tag + " a mute " + member.user.tag + " pour la raison : " + String(reason)).setColor(config.embedColor)

    interaction.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

    member.timeout(ms(d + "d") + ms(h + "h") + ms(m + "m"), reason)
  }
}