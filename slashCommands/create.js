const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const ms = require("ms")
const db = require("../utils/database").getDB()
const config = require("../config/config.json")

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
        const Channel = interaction.options.getChannel("channel")
        const gagnants = interaction.options.getInteger("gagnants")
        const days = interaction.options.getInteger("jours")
        const hours = interaction.options.getInteger("heures")
        const minutes = interaction.options.getInteger("minutes")

        if (!Channel.isText()) {
            return interaction.reply({
                content: "Veuillez choisir un channel texte !",
                ephemeral: true
            })
        }

        db.get(`SELECT * FROM ${id}`, (err, row) => {

            if (row) return interaction.reply({ content: "L'id de ce giveaway existe déjà !", ephemeral: true })

            if (!row) db.each(`CREATE TABLE IF NOT EXISTS '${id}' ('id' VARCHAR, 'top' INTEGER PRIMARY KEY AUTOINCREMENT)`)

            setTimeout(async () => {

                const buttons = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("giveaway:" + id)
                            .setLabel('Participer au giveaway')
                            .setStyle('PRIMARY'),
                    )

                const embed = new MessageEmbed()
                    .setDescription("__**:tada: GIVEAWAY :tada:**__\n\nNombre de gagnants : " + gagnants + " !")
                    .addFields({
                        name: "Lot :",
                        value: lot,
                        inline: true
                    }, {
                        name: "Temps restant :",
                        value: `<t:${ts()}:R>`,
                        inline: true
                    })
                    .setColor(config.embedColor)
                    .setThumbnail(interaction.guild.iconURL())


                const messageSend = await Channel.send({
                    embeds: [embed],
                    components: [buttons],
                })

                db.get(`SELECT * FROM GiveAway WHERE id = ${id}`, (err, row) => {
                    if (!row) db.run(`INSERT INTO GiveAway (id, channelId, gagnants, idMsg, lot) VALUES ('${id}', '${Channel.id}', '${gagnants}', '${messageSend.id}', '${lot}')`)
                })

                interaction.reply({ content: "Le giveaway est en place !", ephemeral: true })

                setTimeout(() => {

                    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${id}'`, (err, row) => {

                        if (!row) return


                        db.all(`SELECT * FROM ${id} ORDER BY RANDOM() LIMIT ${gagnants}`, (err, row) => {

                            if (row.length < gagnants) {
                                const embedFinish = new MessageEmbed()
                                    .setTitle(":tada: GIVEAWAY FINI :tada:")
                                    .setDescription("Le Giveaway est fini !")
                                    .addFields({
                                        name: "Lot :",
                                        value: lot,
                                        inline: true
                                    }, {
                                        name: "Gagnant(s)",
                                        value: `Pas assez de participants :(`,
                                        inline: true
                                    })
                                    .setColor(config.embedColor)
                                    .setFooter("id: " + id)
                                    .setThumbnail("interaction.guild.iconURL()")


                                const buttons = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId(id)
                                            .setLabel('Participer au giveaway')
                                            .setStyle('PRIMARY')
                                            .setDisabled(true),

                                        new MessageButton()
                                            .setCustomId("rien")
                                            .setLabel('Participants: ' + row.length)
                                            .setStyle('SECONDARY')
                                            .setDisabled(true),
                                    )

                                return messageSend.edit({ embeds: [embedFinish], components: [buttons] }) && Channel.send({ content: "Pas assez de participants pour le tirage au sort !" })

                            }

                            const embedFinish = new MessageEmbed()
                                .setTitle(":tada: GIVEAWAY FINI :tada:")
                                .setDescription("Le Giveaway est fini !")
                                .addFields({
                                    name: "Lot :",
                                    value: lot,
                                    inline: true
                                }, {
                                    name: "Gagnant(s)",
                                    value: `${row.map(e => "<@" + e.id + ">").join("\n")}`,
                                    inline: true
                                })
                                .setColor(config.embedColor)
                                .setFooter("id: " + id)
                                .setThumbnail("interaction.guild.iconURL()")
                            let buttons;
                            db.all(`SELECT * FROM ${id}`, async (err, row) => {

                                buttons = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId(id)
                                            .setLabel('Participer au giveaway')
                                            .setStyle('PRIMARY')
                                            .setDisabled(true),

                                        new MessageButton()
                                            .setCustomId("rien")
                                            .setLabel('Participants: ' + row.length)
                                            .setStyle('SECONDARY')
                                            .setDisabled(true),
                                    )


                            })

                            messageSend.edit({ embeds: [embedFinish], components: [buttons] })
                            Channel.send({ content: `${row.map(e => "<@" + e.id + ">").join(", ")} ${row.length > 1 ? "ont" : "a"} gagné le giveaway !` })
                        })

                    })

                }, ms(days + "d") + ms(hours + "h") + ms(minutes + "m"))

            }, 1000)
        })

        /*
        function deleteDB(db, id) {
            db.get(`SELECT * FROM ${id}`, (err, row) => {
                if(!row) return
                db.run(`SELECT * FROM GiveAway DROP ${id}`)
                db.each(`DROP TABLE '${id}'`)
            }) 

        }*/

        function ts() {
            let jours = days * 86400
            let heure = hours * 600
            let minut = minutes * 60

            return Math.round(+new Date() / 1000) + jours + heure + minut
        }
    },
}