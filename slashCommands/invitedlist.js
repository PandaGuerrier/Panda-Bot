const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitedlist')
    .setDescription('Voir qui la personne mentionnée a invité')
    .addUserOption(option => option.setName('membre').setDescription('Voir ses invitations').setRequired(false)),

  async execute(interaction) {

    let membre = interaction.options.getUser("membre")
    if (!membre) membre = interaction.member.user

    const invite = await interaction.client.db.models.User.findAll({
      where: {
        id: membre.id
      }
    })

    if (invite.length <= 0) return interaction.reply({
      content: "Vous n'avez invité personne pour le moment !",
      ephemeral: true
    })

    const embed = new MessageEmbed()
      .setTitle(`${membre.id === interaction.member.user.id ? "Vous avez" : `${membre} a`} invité :`)
      .setDescription((invite.map((e, i) => {
        return `${i + 1}. **<@${e.dataValues.id}>**`
      })).slice(0, 200).join('\n') + `\n\n${invite.length > 200 ? `Et ${invite.length - 200} autres personnes !` : ``}`)
      .setColor(config.embedColor)

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}