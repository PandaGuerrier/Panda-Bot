const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const config = require("../config/config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup')
    .addStringOption(option =>
      option.setName('quoi')
        .setDescription('Que veut tu setup ?')
        .setRequired(true)
        .addChoices({name: 'Tickets', value: 'tickets'})
        .addChoices({name: 'Verification', value: 'verification'})),

  async execute(interaction) {

    const menu = interaction.options.getString("quoi");

    if (menu === "tickets") {

      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('ticket')
            .setPlaceholder('Sélectionnez la raison du ticket')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
              ...config.tickets.categories.map(category => ({
                  label: category.name,
                  value: category.name,
                  emoji: category.emoji
              }))
                
            ]),
        );

      const emb = new MessageEmbed()
        .setTitle(config.informations.serverName + " - Ticket")
        .setDescription("Créez un ticket support en **sélectionnant** la catégorie correspondante à votre demande.\n\n" + config.tickets.categories.map(category => `${category.emoji} **- ${category.name}**`).join("\n"))
        .setColor(config.embedColor)

      await interaction.channel.send({ embeds: [emb], components: [row] })
      await interaction.reply({ content: "C'est fait !", ephemeral: true })
    } else if (menu === "verification") {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('boutonVerification')
            .setLabel('Verification')
            .setEmoji("🛡️")
            .setStyle('PRIMARY'),
        );

      const emb = new MessageEmbed()
        .setDescription(`Pour éviter toutes attaques de bots, nous avons mis en place un système **ANTI-BOT**.\n\nLa seule chose que vous avez à faire c'est de cliquer sur le bouton ci dessous.\n\n**Bon jeux sur Tenshi.**`)
        .setColor(config.embedColor)

        await interaction.channel.send({ embeds: [emb], components: [row] })
        await interaction.reply({ content: "C'est bon bg !", ephemeral: true })
    }
  },
}