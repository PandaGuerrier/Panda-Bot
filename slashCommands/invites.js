const {
    SlashCommandBuilder
} = require('@discordjs/builders')
const config = require("../config/config.json")
const Discord = require("discord.js")
const sqlite3 = require('sqlite3').verbose()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Voir les invitations de quelqu'un")
        .addUserOption(option => option.setName('membre').setDescription('Ajouter des invitations a cette personne').setRequired(false)),
    role: ["959209575272312933"],
    async execute(client, interaction) {


        let membre = interaction.options.getUser("membre")

        if(!membre) membre = interaction.member.user

        const db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)

            db.get(`SELECT * FROM inviter WHERE id = '${membre.id}'`, (err, row) => {
              if (err) {
                console.error(err.message)
              }

              const noInviteEmbed = new Discord.MessageEmbed()
              .setDescription(`${membre.id === interaction.member.user.id ? "Vous n'avez" : `${membre} n'à`} aucune invitation enregistrée !`)
              .setColor(config.embedColor)

              if(!row) return interaction.reply({embeds: [noInviteEmbed], ephemeral: true})

              else {
                  const yesInviteEmbed = new Discord.MessageEmbed()
                  .setDescription(`${membre.id === interaction.member.user.id ? "Vous avez" : `${membre} à`} ${row.numero} invitation(s) (${row.normal} normale(s), ${row.partie} partie(s), ${row.bonus} bonus)`)
                  .setColor(config.embedColor)

                  interaction.reply({embeds: [yesInviteEmbed], ephemeral: true})
              }
            })

        db.close()







    },
}