const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autolb')
    .setDescription("Parametrer l'autoLeaderBoard")
    .addStringOption(option =>
      option.setName('quoi')
        .setDescription('Que veut tu faire ?')
        .setRequired(true)
        .addChoices({ name: 'Setup', value: 'setup' })
        .addChoices({ name: 'Remove', value: 'remove' })),

  async execute(interaction) {
    const menu = interaction.options.getString("quoi")

    if (menu == 'remove') {

      const isActif = await interaction.client.db.models.Setup.findOne({ where: { actif: true } })
      if (isActif) {
        await interaction.client.db.models.Setup.destroy({ where: { actif: true } })

        await interaction.reply({ content: "Le leaderboard est maintenant désactivé !", ephemeral: true })
      } else {
        await interaction.reply({ content: "Le leaderboard automatique n'est pas activé.", ephemeral: true })
      }
    } else {

      const embed = new MessageEmbed()
        .setTitle("INSTALLATION...")
        .setColor(config.embedColor)

      const msg = await interaction.channel.send({ embeds: [embed] })
      const autoLb = await interaction.client.db.models.Setup.findOne({ where: { actif: true } })

      if (!autoLb) {
        await interaction.client.db.models.Setup.create({ actif: true, channelId: interaction.channel.id, id: msg.id })
      } else {
        await interaction.client.db.models.Setup.update({ actif: true, channelId: interaction.channel.id, id: msg.id }, { where: { actif: false } })
      }

      await interaction.reply({ content: "Le leaderboard est en cours d'installation, il va bientôt s'actualiser !", ephemeral: true })
    }
  },
}