const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require('../utils/database.js').getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gwnumber')
        .setDescription('Voir combien de personnes participent au giveaway !')
        .addStringOption(option => option.setName('id').setDescription("L'id du giveaway").setRequired(true)),

    async execute(interaction) {

        const id = interaction.options.getString("id")

        db.all(`SELECT * FROM ${id}`, (err, row) => {
            if (!row) return interaction.reply({ content: "L'id de ce giveaway n'existe pas !", ephemeral: true })
            else {
                if (row.length <= 0) return interaction.reply({ content: "Aucun bot kick :O", ephemeral: true })

                interaction.reply({ content: `Il y a actuellement ${row.length} personne(s) qui participent à ce giveaway !`, ephemeral: true })
            }
        })
    },
}