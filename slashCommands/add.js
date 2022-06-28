const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Ajouter quelqu'un au ticket !")
        .addUserOption(option => option.setName('mention').setDescription('Le membre a ajouter').setRequired(true)),

    async execute(interaction) {
        if (interaction.channel.name.startsWith("❓") || interaction.channel.name.startsWith("⛑️") || interaction.channel.name.startsWith("🤝") || interaction.channel.name.startsWith("🏁") || interaction.channel.name.startsWith("📂")) {

            const membre = interaction.options.getUser("mention")

            const embed = new Discord.MessageEmbed()
                .setTitle("Succ\u00e8s")
                .setDescription(`J'ai bien ajout\u00e9 ${membre} au ticket !`)
                .setColor(config.embedColor)

            interaction.channel.permissionOverwrites.edit(membre.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
            }).then(() => {
                interaction.reply({ embeds: [embed] })
            })


        }
        else { return }
    }
}