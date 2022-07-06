const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Ajouter quelqu'un au ticket !")
        .addUserOption(option => option.setName('mention').setDescription('Le membre a ajouter').setRequired(true)),

    async execute(interaction) {
        if(interaction.channel.topic === "ticket") {
            const membre = interaction.options.getUser("mention")

            const embed = new MessageEmbed()
                .setTitle("Succ\u00e8s")
                .setDescription(`J'ai bien ajout\u00e9 ${membre} au ticket !`)
                .setColor(config.embedColor)

            interaction.channel.permissionOverwrites.edit(membre.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
            }).then(async () => {
                await interaction.reply({ embeds: [embed] })
            })


        }
        else { return }
    }
}