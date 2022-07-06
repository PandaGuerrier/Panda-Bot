const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const ms = require("ms")
const config = require("../config/config.json")
const { tempsRestant } = require("../utils/functions.js")
const { Sequelize } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Créer un giveaway !')
        .addStringOption(option => option.setName('id').setDescription("L'id du giveaway").setRequired(true))
        .addStringOption(option => option.setName('lot').setDescription('Le lot du giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('gagnants').setDescription('Le nombre de gagnants').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Le channel du giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('jours').setDescription('Le nombre de jours du giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('heures').setDescription("Le nombre d'heures du giveaway").setRequired(true))
        .addIntegerOption(option => option.setName('minutes').setDescription('Le nombre de minutes du giveaway').setRequired(true)),

    async execute(interaction) {

        const lot = interaction.options.getString("lot")
        const id = interaction.options.getString("id")
        const channel = interaction.options.getChannel("channel")
        const gagnants = interaction.options.getInteger("gagnants")
        const days = interaction.options.getInteger("jours")
        const hours = interaction.options.getInteger("heures")
        const minutes = interaction.options.getInteger("minutes")

        if (!channel.isText()) return await interaction.reply({ content: "Veuillez choisir un channel texte !", ephemeral: true })

        const isGiveawayExist = await interaction.client.db.models.Giveaway.findOne({ where: { id: id } })

        if (isGiveawayExist) return await interaction.reply({ content: "L'id de ce giveaway existe déjà !", ephemeral: true })

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("giveaway:" + id)
                    .setLabel('Participer au giveaway')
                    .setStyle('PRIMARY'),
            )

        const embed = new MessageEmbed()
            .setDescription("__**:tada: GIVEAWAY :tada:**__\n\nNombre de gagnants: " + gagnants + " !")
            .addFields(
                { name: "Lot:", value: lot, inline: true },
                { name: "Temps restant:", value: `<t:${tempsRestant(days, hours, minutes)}:R>`, inline: true },
                { name: "Id du giveaway:", value: id, inline: true },
            )
            .setColor(config.embedColor)
            .setThumbnail(interaction.guild.iconURL())


        const messageSend = await channel.send({ embeds: [embed], components: [buttons] })

        await interaction.client.db.models.Giveaway.create({
            id: id,
            messageId: messageSend.id,
            channelId: channel.id,
            gagnants: gagnants,
            lot: lot,
            users: []
        })

        await interaction.reply({ content: "Le giveaway est en place !", ephemeral: true })

        setTimeout(async () => {

            const giveaway = await interaction.client.db.models.Giveaway.findOne({ where: { id: id } })
            if (giveaway.dataValues.users.length <= gagnants) {
                const embedFinish = new MessageEmbed()
                    .setTitle(":tada: GIVEAWAY FINI :tada:")
                    .setDescription("Le Giveaway est fini !")
                    .addFields(
                        { name: "Lot :", value: lot, inline: true },
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

                return await messageSend.edit({ embeds: [embedFinish], components: [buttons] }) && channel.send({ content: "Pas assez de participants pour le tirage au sort !" })
            }

            const winnerGiveaway = await interaction.client.db.models.Giveaway.findAll({ order: Sequelize.literal('rand()'), limit: gagnants })

            const embedFinish = new MessageEmbed()
                .setTitle(":tada: GIVEAWAY FINI :tada:")
                .setDescription("Le Giveaway est fini !")
                .addFields(
                    { name: "Lot :", value: lot, inline: true },
                    { name: "Gagnant(s)", value: `${giveaway.dataValues.users.map(e => `<@${e.id}> (${e.username})`).join("\n")}`, inline: true }
                )
                .setColor(config.embedColor)
                .setThumbnail(interaction.guild.iconURL())

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("rien")
                        .setLabel('Participants: ' + row.length)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                )

            await messageSend.edit({ embeds: [embedFinish], components: [buttons] })
            await channel.send({ content: `${row.map(e => "<@" + e.id + ">").join(", ")} ${giveaway.dataValues.users.length > 1 ? "ont" : "a"} gagné le giveaway !` })
        }, ms(days + "d") + ms(hours + "h") + ms(minutes + "m"))
    },
}