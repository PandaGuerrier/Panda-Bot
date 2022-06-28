const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Fermer le ticket'),


    async execute(interaction) {

        if (interaction.channel.name.startsWith("❓") || interaction.channel.name.startsWith("⛑️") || interaction.channel.name.startsWith("🤝") || interaction.channel.name.startsWith("🏁") || interaction.channel.name.startsWith("📂")) {

            const embed1 = new Discord.MessageEmbed()
                .setTitle("TICKET")
                .setDescription("Êtes vous sûr de vouloir fermer le ticket ?")
                .setColor(config.embedColor)
            const sur = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('closed')
                        .setLabel('Oui')
                        .setEmoji('\u2714\ufe0f')
                        .setStyle('PRIMARY'),

                    new Discord.MessageButton()
                        .setCustomId('nan')
                        .setLabel('Non')
                        .setEmoji("\u274c")
                        .setStyle('DANGER'),
                )

            interaction.reply({ embeds: [embed1], components: [sur] })
        }
        else {
            return
        }
    }
}