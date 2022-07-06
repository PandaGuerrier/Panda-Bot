const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Relancer un giveaway')
        .addStringOption(option => option.setName('id').setDescription("L'id giveaway !").setRequired(true)),

    async execute(interaction) {

        const idGiveaway = interaction.options.getString("id")

                db.get(`SELECT * FROM GiveAway WHERE id = '${idGiveaway}'`, async (err, rowa) => {
                    const Channel = interaction.guild.channels.cache.get(rowa.channelId)

                    if (!rowa) return interaction.reply({
                        content: "L'id que vous avez fourni n'existe pas !",
                        ephemeral: true
                    })

                    const messageGiveaway = await interaction.channel.messages.fetch(rowa.idMsg)

                    db.all(`SELECT * FROM ${idGiveaway} ORDER BY RANDOM() LIMIT ${rowa.gagnants}`, (err, row) => {

                        if (!row) return Channel.send({content: "Pas assez de participants pour le tirage au sort !", ephemeral: true})

                        if (row.gagnants >= row.length) return interaction.reply({content: "Pas assez de participants pour le tirage au sort !", ephemeral: true})

                            buttons = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("rien")
                                        .setLabel('Participants: ' + row.length)
                                        .setStyle('SECONDARY')
                                        .setDisabled(true),
                                )

                        const embedFinish = new MessageEmbed()
                            .setTitle(":tada: GIVEAWAY FINI :tada:")
                            .setDescription("Le Giveaway est fini !")
                            .addFields({
                                name: "Lot :",
                                value: `${String(rowa.lot)}`,
                                inline: true
                            }, {
                                name: "Gagnant(s)",
                                value: `${row.map(e => "<@" + e.id + ">").join("\n")}`,
                                inline: true
                            })
                            .setColor(config.embedColor)
                            .setThumbnail("interaction.guild.iconURL()")

                        messageGiveaway.edit({
                            embeds: [embedFinish],
                            components: [buttons]
                        })
                        Channel.send({
                            content: `${row.map(e => "<@" + e.id + ">").join(", ")} ${row.length > 1 ? "ont" : "a"} gagné le giveaway !`
                        })

                        interaction.reply({ content: "Le Giveaway a bien été reroll !", ephemeral: true })
                    })
                })
    },
}