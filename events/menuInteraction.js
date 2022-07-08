const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const config = require("../config/config.json")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === 'ticket') {

            if (config.tickets.categories.some(r => r.name === interaction.values[0])) {

                let optionsConfig
                for (let ticketConfig = 0; ticketConfig < config.tickets.categories.length; ticketConfig++) {
                    if (interaction.values[0] === config.tickets.categories[ticketConfig].name) {
                        optionsConfig = config.tickets.categories[ticketConfig]
                    } else {
                        continue
                    }
                }

                await interaction.message.edit()

                const em = new MessageEmbed()
                    .setTitle("Erreur")
                    .setDescription("Vous avez d\u00e9j\u00e0 un ticket ouvert !")
                    .setColor(config.embedColor)

                if (interaction.channel.guild.channels.cache.find(c => c.name == `${optionsConfig.emoji}・${interaction.member.user.username}`.split(' ').join('-').toLocaleLowerCase())) return await interaction.reply({ embeds: [em], ephemeral: true })


                const log = new MessageEmbed()
                    .setTitle('Nouveau Ticket')
                    .setColor('#2BFA02')
                    .setDescription(interaction.member.user.tag + " \u00e0 ouvert un ticket !")

                await interaction.message.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

                const channel = await interaction.channel.guild.channels.create(optionsConfig.emoji + '・' + interaction.member.user.username, {
                    type: 'GUILD_TEXT',
                    parent: optionsConfig.categorieId,
                    permissionOverwrites: [
                        {
                            id: interaction.message.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            id: interaction.member.id
                        },
                        ...optionsConfig.rolesAccess.map(id => ({
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            id: id
                        })),
                        ...config.roles.admin.map(id => ({
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            id: id
                        })),

                    ]
                })

                const openEmbed = new MessageEmbed()
                    .setTitle("Ticket ouvert !")
                    .setDescription("Channel : <#" + channel + ">")
                    .setColor(config.embedColor)

                await interaction.reply({ embeds: [openEmbed], ephemeral: true })

                const sent = await channel.send(`${interaction.member.user}`)
                
                setTimeout(() => {
                    sent.delete()
                }, 500)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('closed2')
                            .setLabel('Fermer')
                            .setEmoji("🗑️")
                            .setStyle('DANGER'),
                    )

                const closeEmbed = new MessageEmbed()
                    .setDescription(optionsConfig.welcomeMessage)
                    .addFields({ name: "Auteur du ticket :", value: interaction.member.user.username }).setColor(config.embedColor)

                await channel.send({ embeds: [closeEmbed], components: [row] })
                await channel.setTopic("ticket")
            }
        }
    }
}

