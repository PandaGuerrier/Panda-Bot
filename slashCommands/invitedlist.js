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

    db.all(`SELECT * FROM users WHERE inviterId = ${membre.id}`, async (err, row) => {
      if (err) throw err


      if (row.length <= 0) return interaction.reply({
        content: "Vous n'avez invité personne pour le moment !",
        ephemeral: true
      })

      const embed = new MessageEmbed()
        .setTitle(`${membre.id === interaction.member.user.id ? "Vous avez" : `${membre} a`} invité :`)
        .setDescription((row.map((e, i) => {
          return `${i + 1}. **<@${e.id}>**`
        })).slice(0, 200).join('\n') + `\n\n${row.length > 200 ? `Et ${row.length - 200} autres personnes !` : ``}`)
        .setColor(config.embedColor)

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      })

    })

  },
}