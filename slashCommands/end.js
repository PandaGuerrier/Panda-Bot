const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require("../utils/database").getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('Finir un giveaway !')
        .addStringOption(option => option.setName('id').setDescription("L'id du giveaway").setRequired(true)),

    async execute(client, interaction) {

        const id = interaction.options.getString("id")

        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${id}'`, (err, row) => {

            if(!row) return interaction.reply({content: "L'id de ce giveaway n'existe pas !", ephemeral: true})
            else {
                db.run(`DROP TABLE ${id}`)
                db.run(`DELETE FROM GiveAway WHERE id='${id}'`)
                interaction.reply({content: "Le giveaway a bien été supprimé !", ephemeral: true})
            }


        })
    },
}