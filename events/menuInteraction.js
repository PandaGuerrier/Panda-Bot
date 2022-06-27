const Discord = require("discord.js")
const config = require("../config/config.json")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === 'ticket') {
            createTicket("📂", "plainte", "Bienvenue sur le ticket, \n\nveuillez donner un maximum de preuves !")
            createTicket("🏁", "starterPack", "Bienvenue sur le ticket, \n\nveuillez envoyer un screenshot de vôtre faction pour recevoir le Starter Pack !")
            createTicket("🤝", "partenariat", "Bienvenue sur le ticket, \n\nveuillez attendre, un membre du staff va vous répondre !")
            createTicket("⛑️", "support", "Bienvenue sur le ticket, \n\nveuillez décrire votre problème !")
            createTicket("❓", "autre", "Bienvenue sur le ticket, \n\nveuillez décrire votre problème !")

            function createTicket(emojie, buttonId, welcomeMessage) {

                if (interaction.values[0] == buttonId) {


                const em = new Discord.MessageEmbed()
                    .setTitle("Erreur")
                    .setDescription("Vous avez d\u00e9j\u00e0 un ticket ouvert !")
                    .setColor(config.embedColor)

                if (interaction.channel.guild.channels.cache.find(c => c.name == `${emojie}・${interaction.member.user.username}`.split(' ').join('-').toLocaleLowerCase())) return interaction.reply({ embeds: [em], ephemeral: true })


                const log = new Discord.MessageEmbed()
                    .setTitle('Nouveau Ticket')
                    .setColor('#2BFA02')
                    .setDescription(interaction.member.user.tag + " \u00e0 ouvert un ticket !")

                interaction.message.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

                interaction.channel.guild.channels.create(emojie + '・' + interaction.member.user.username, {
                    type: 'GUILD_TEXT',
                    parent: config.ticket.categorie,
                    permissionOverwrites: [
                        {
                            id: interaction.message.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            id: interaction.member.id
                        },
                        ...config.ticket.rolesAccès.map(id => ({
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
                        .setDescription(welcomeMessage)
                        .addFields({ name: "Auteur du ticket :", value: interaction.member.user.username }).setColor(config.embedColor)

                    channel.send({ embeds: [closeEmbed], components: [row] })


                })
              }
            }

        }
    }
}