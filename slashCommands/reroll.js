const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const config = require("../config/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Relancer un giveaway')
        .addStringOption(option => option.setName('id').setDescription("L'id giveaway !").setRequired(true)),

    async execute(interaction) {

        const idGiveaway = interaction.options.getString("id")

        const giveaway = await interaction.client.db.models.Giveaway.findOne({ where: { id: idGiveaway } })

        const channel = interaction.guild.channels.cache.get(giveaway.dataValues.channelId)

        if (!giveaway) return await interaction.reply({ content: "Ce giveaway n'existe pas !", ephemeral: true })
        if (!channel) return await interaction.reply({ content: "Ce channel n'existe pas !", ephemeral: true })

        const messageSend = await channel.messages.fetch(giveaway.dataValues.messageId)

        if (giveaway.dataValues.users.length <= giveaway.dataValues.gagnants) {


            const embedFinish = new MessageEmbed()
                .setTitle(":tada: GIVEAWAY FINI :tada:")
                .setDescription("Le Giveaway est fini !")
                .addFields(
                    { name: "Lot :", value: giveaway.dataValues.lot, inline: true },
                    { name: "Gagnant(s)", value: `Pas assez de participants :(`, inline: true }
                )
                .setColor(config.embedColor)
                .setThumbnail(interaction.guild.iconURL())

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("rien")
                        .setLabel('Participants: ' + giveaway.dataValues.users.length)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                )

            return await messageSend.edit({ embeds: [embedFinish], components: [buttons] }) && await interaction.reply({ content: "Pas assez de participants pour le tirage au sort !" })
        }

        const winners = []

        for (let i = 0; i < giveaway.dataValues.gagnants; i++) {
            const winner = giveaway.dataValues.users.sort(() => 0.5 - Math.random()).slice(0, 1);
            winners.push(winner[0])
            giveaway.dataValues.users.splice(giveaway.dataValues.users.indexOf(winner[0]), 1)
        }

        const embedFinish = new MessageEmbed()
            .setTitle(":tada: GIVEAWAY FINI :tada:")
            .setDescription("Le Giveaway est fini !")
            .addFields(
                { name: "Lot :", value: giveaway.dataValues.lot, inline: true },
                { name: "Gagnant(s)", value: `${winners.map(e => `<@${e}>`).join(", ")}`, inline: true }
            ).setColor(config.embedColor)
            .setThumbnail(interaction.guild.iconURL())

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("rien")
                    .setLabel('Participants: ' + giveaway.dataValues.users.length)
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )

        await messageSend.edit({ embeds: [embedFinish], components: [buttons] })
        await channel.send({ content: `${winners.map(e => "<@" + e + ">").join(", ")} ${winners.length > 1 ? "ont" : "a"} gagné le giveaway !` })
        await interaction.reply({ content: "Tirage refait !", ephemeral: true })
    },
}