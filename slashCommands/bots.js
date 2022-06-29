const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config/config.json");
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('Voir le nombre de bots kick par le superbe anti bots !'),

  async execute(interaction) {

    db.all(`SELECT * FROM bots`, async (err, row) => {
      if (err) throw err;

      if (row.length <= 0) return interaction.reply({ content: "Aucun bot kick :O", ephemeral: true })

      const embed = new MessageEmbed()
        .setDescription(`${row.length} bots kick par le superbe anti bot !`)
        .setColor(config.embedColor)

      interaction.reply({ embeds: [embed], ephemeral: true })

    })
  }
}