const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require("../utils/database").getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('Finir un giveaway !')
        .addStringOption(option => option.setName('id').setDescription("L'id du giveaway").setRequired(true)),

    async execute(interaction) {

        const id = interaction.options.getString("id")

        const giveaway = await interaction.client.db.models.Giveaway.findOne({
            where: {
                id: id
            }
        })

        if (!giveaway) return await interaction.reply({ content: "L'id de ce giveaway n'existe pas !", ephemeral: true })
        else {
            interaction.client.db.models.Giveaway.destroy({
                where: {
                    id: id
                }
            })
            await interaction.reply({ content: "Le giveaway a bien été supprimé !", ephemeral: true })
        }
    },
}