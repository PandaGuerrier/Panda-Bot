const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer des messages')
        .addIntegerOption(option => option.setName('nombre').setDescription('Le nombre de messages a supprimer').setRequired(true)),

    async execute(interaction) {

        let nm = interaction.options.getInteger("nombre")

        if (nm < 0) return interaction.reply({ content: "Veuillez entrer un nombre sup\u00e9rieur à 0 !", ephemeral: true })
        const emb = new MessageEmbed()
            .setTitle("Succ\u00e8s !")
            .setDescription("J'ai bien supprim\u00e9 " + nm + " messages !")
            .setColor(config.embedColor)

        interaction.channel.bulkDelete(nm).catch((e) => {

        })
            .catch((e) => {
                interaction.reply({ content: "D\u00e9sol\u00e9, il y a une erreur. \nCela est peut \u00eatre possible si vous essayez de supprimer des messages de + 14 jours !", ephemeral: true })
            })
        await interaction.reply({ embeds: [emb], ephemeral: true })
    },
}