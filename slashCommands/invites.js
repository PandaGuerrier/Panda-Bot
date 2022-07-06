const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Voir les invitations de quelqu'un")
        .addUserOption(option => option.setName('membre').setDescription('Ajouter des invitations a cette personne').setRequired(false)),

    async execute(interaction) {


        let membre = interaction.options.getUser("membre")

        if (!membre) membre = interaction.member.user

        const invite = await interaction.client.db.models.Invite.findOne({
            where: {
                id: membre.id
            }
        })

        const noInviteEmbed = new MessageEmbed()
            .setDescription(`${membre.id === interaction.member.user.id ? "Vous n'avez" : `${membre} n'à`} aucune invitation enregistrée !`)
            .setColor(config.embedColor)

        if (!invite) return interaction.reply({ embeds: [noInviteEmbed], ephemeral: true })

        else {
            const yesInviteEmbed = new MessageEmbed()
                .setDescription(`${membre.id === interaction.member.user.id ? "Vous avez" : `${membre} à`} ${invite.dataValues.numero} invitation(s) (${invite.dataValues.normal} normale(s), ${invite.dataValues.partie} partie(s), ${invite.dataValues.bonus} bonus)`)
                .setColor(config.embedColor)

            interaction.reply({ embeds: [yesInviteEmbed], ephemeral: true })
        }
    },
}