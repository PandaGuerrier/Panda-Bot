const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config/config.json");
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('Voir le nombre de bots kick par le superbe anti bots !'),

  async execute(interaction) {

    const manyBots = await interaction.client.db.models.Bots.findAll()

    if (manyBots.length <= 0) return interaction.reply({ content: "Aucun bot kick :O", ephemeral: true })

    const embed = new MessageEmbed()
      .setDescription(`${manyBots.length} bots kick par le superbe anti bot !`).setColor(config.embedColor)

    await interaction.reply({ embeds: [embed], ephemeral: true })
  }
}