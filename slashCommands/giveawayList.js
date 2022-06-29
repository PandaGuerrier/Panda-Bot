const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('glist')
        .setDescription('Voir la liste des giveaways !'),

    async execute(interaction) {

        db.all(`SELECT * FROM GiveAway`, (err, row) => {

            if (!row) return interaction.reply({ content: "Aucun giveaway n'est dans la base de donnée !", ephemeral: true })

            const embed = new MessageEmbed()
                .setDescription("**Voici les giveaway :** \n\n" + (row.map((e, i) => { return i + 1 + ". **ID:** " + e.id + ", **Lot:** " + e.lot }).join("\n")))
                .setColor(config.embedColor)

            interaction.reply({ embeds: [embed], ephemeral: true })
        })

    },
}