const Discord = require("discord.js")
const config = require("../config/config.json")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === 'ticket') {

            if (config.tickets.categories.some(r => r.name === interaction.values[0])) {
                
                let optionsConfig
                for(let ticketConfig = 0; ticketConfig < config.tickets.categories.length; ticketConfig++) {
                    if(interaction.values[0] === config.tickets.categories[ticketConfig].name) {
                        optionsConfig = config.tickets.categories[ticketConfig]
                    } else {
                        continue
                    }
                }

                await interaction.message.edit()

                const em = new Discord.MessageEmbed()
                    .setTitle("Erreur")
                    .setDescription("Vous avez d\u00e9j\u00e0 un ticket ouvert !")
                    .setColor(config.embedColor)

                if (interaction.channel.guild.channels.cache.find(c => c.name == `${optionsConfig.emoji}・${interaction.member.user.username}`.split(' ').join('-').toLocaleLowerCase())) return interaction.reply({ embeds: [em], ephemeral: true })


                const log = new Discord.MessageEmbed()
                    .setTitle('Nouveau Ticket')
                    .setColor('#2BFA02')
                    .setDescription(interaction.member.user.tag + " \u00e0 ouvert un ticket !")

                interaction.message.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

                interaction.channel.guild.channels.create(optionsConfig.emoji + '・' + interaction.member.user.username, {
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
                }).then(async (channel) => {

                    const openEmbed = new Discord.MessageEmbed()
                        .setTitle("Ticket ouvert !")
                        .setDescription("Channel : <#" + channel + ">")
                        .setColor(config.embedColor)

                    interaction.reply({ embeds: [openEmbed], ephemeral: true })

                    channel.send(`${interaction.member.user}`).then((sent) => {
                        setTimeout(() => {
                            sent.delete()
                        }, 500)
                    })
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('closed2')
                                .setLabel('Fermer')
                                .setEmoji("🗑️")
                                .setStyle('DANGER'),
                        )


                    const closeEmbed = new Discord.MessageEmbed()
                        .setDescription(optionsConfig.welcomeMessage)
                        .addFields({ name: "Auteur du ticket :", value: interaction.member.user.username }).setColor(config.embedColor)

                    channel.send({ embeds: [closeEmbed], components: [row] })
                })
            }
        }
    }
}

