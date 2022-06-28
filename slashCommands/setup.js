const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require("discord.js")
const config = require("../config/config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup')
    .addStringOption(option =>
      option.setName('quoi')
        .setDescription('Que veut tu setup ?')
        .setRequired(true)
        .addChoice('Tickets', 'tickets')
        .addChoice('Verification', 'verification')),
  role: [],

  async execute(client, interaction) {

    const menu = interaction.options.getString("quoi");

    if (menu === "tickets") {

      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
            .setCustomId('ticket')
            .setPlaceholder('Sélectionnez la raison du ticket')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
              {
                label: '• Plainte',
                value: 'plainte',
                emoji: "📂"
              },
              {
                label: '• Starter Pack',
                value: 'starterPack',
                emoji: "🏁"
              },
              {
                label: '• Partenariat',
                value: 'partenariat',
                emoji: "🤝"
              },
              {
                label: '• Support',
                value: 'support',
                emoji: "⛑️"
              },
              {
                label: '• Autre',
                value: 'autre',
                emoji: "❓"
              }
            ]),
        );

      const emb = new Discord.MessageEmbed()
        .setTitle("Tenshi - Ticket")
        .setDescription("Créez un ticket support en **sélectionnant** la catégorie correspondante à votre demande.\n\n:open_file_folder: **- Plainte**\n:checkered_flag: **- Starter Pack**\n:handshake: **- Partenariat**\n:helmet_with_cross: **- Support**\n:question: **- Autre**")
        .setColor(config.embedColor)

      interaction.channel.send({ embeds: [emb], components: [row] })
      interaction.reply({ content: "C'est fait !", ephemeral: true })
    } else if (menu === "verification") {
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('boutonVerification')
            .setLabel('Verification')
            .setEmoji("🛡️")
            .setStyle('PRIMARY'),
        );

      const emb = new Discord.MessageEmbed()
        .setDescription(`Pour éviter toutes attaques de bots, nous avons mis en place un système **ANTI-BOT**.\n\nLa seule chose que vous avez à faire c'est de cliquer sur le bouton ci dessous.\n\n**Bon jeux sur Tenshi.**`)
        .setColor(config.embedColor)
        .setImage("https://cdn.discordapp.com/attachments/959519366892908544/960288664976523364/logo_tenshi2.png")

      interaction.channel.send({ embeds: [emb], components: [row] })
      interaction.reply({ content: "C'est bon bg !", ephemeral: true })
    }
  },
}