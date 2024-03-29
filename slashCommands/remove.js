const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription("Enlever quelqu'un du ticket !")
        .addUserOption(option => option.setName('mention').setDescription('Le membre a enlever').setRequired(true)),

    async execute(interaction) {

        if (interaction.channel.topic === "ticket") {

            const membre = interaction.options.getUser("mention")

            const embed = new MessageEmbed()
                .setTitle("Succ\u00e8s")
                .setDescription(`J'ai bien retir\u00e9 ${membre} au ticket !`)
                .setColor(config.embedColor)

            await interaction.channel.permissionOverwrites.edit(membre.id, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false,
            })

            await interaction.reply({ embeds: [embed] })

        }
        else {
            return
        }
    }
}