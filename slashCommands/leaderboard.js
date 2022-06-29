const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Voir le classement des invitations'),

  async execute(interaction) {

    db.all(`SELECT * FROM inviter ORDER BY numero DESC`, async (err, row) => {
      if (err) throw err

      if (row.length <= 0) return interaction.reply({ content: "Aucun classement pour le moment !", ephemeral: true })

      const embed = new MessageEmbed()
        .setTitle("Classement des invitations !")
        .setDescription("Voici le classement :\n \n" + (row.map((e, i) => { return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)` })).slice(0, 10).join('\n') + `\n\nBon jeux sur ${config.informations.serverName} !`)
        .setColor(config.embedColor)

      let btn2

      if (row.length <= 10) {

        btn2 = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('precedent:1')
              .setLabel('Page précedente')
              .setStyle('PRIMARY')
              .setDisabled(true),

            new MessageButton()
              .setCustomId('home')
              .setLabel('🏠')
              .setStyle('PRIMARY'),

            new MessageButton()
              .setCustomId('suivant:2')
              .setLabel('Page suivante')
              .setStyle('PRIMARY')
              .setDisabled(true),
          )
      } else {
        btn2 = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('precedent:1')
              .setLabel('Page précedente')
              .setStyle('PRIMARY')
              .setDisabled(true),

            new MessageButton()
              .setCustomId('home')
              .setLabel('🏠')
              .setStyle('PRIMARY'),

            new MessageButton()
              .setCustomId('suivant:2')
              .setLabel('Page suivante')
              .setStyle('PRIMARY'),

          )
      }

      interaction.reply({ embeds: [embed], components: [btn2] })



      /**
       * *
       * *
       * * Collector 
       * *
       * *
       */

      const filter = i => i.user.id === interaction.user.id

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 })

      collector.on('collect', async (i) => {


        if (i.customId.includes("precedent:")) {

          const boutonSansString = parseInt(i.customId.replace("precedent:", ""))

          const msg = await interaction.channel.messages.fetch(i.message.id)

          const embedPrecedent = new MessageEmbed()
            .setTitle("Classement des invitations !")
            .setDescription("Voici le classement :\n \n" + (row.map((e, i) => { return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)` })).slice(boutonSansString * 10 - 10, boutonSansString * 10).join('\n') + `\n\nBon jeux sur ${config.informations.serverName} !`)
            .setColor(config.embedColor)

          let boutons

          if (boutonSansString === 1) {
            boutons = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId(`precedent:${boutonSansString - 1}`)
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY')
                  .setDisabled(true),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId(`suivant:${boutonSansString + 1}`)
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY'),
              )
          } else {
            boutons = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId(`precedent:${boutonSansString - 1}`)
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId(`suivant:${boutonSansString + 1}`)
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY'),
              )
          }

          msg.edit({ embeds: [embedPrecedent], components: [boutons] })

          /**
           * 
           * 
           *  BOUTON SUIVANT
           * 
           * 
           */


        } else if (i.customId.includes("suivant:")) {


          const boutonSansString = parseInt(i.customId.replace("suivant:", ""))

          const msg = await interaction.channel.messages.fetch(i.message.id)

          const embedSuivant = new MessageEmbed()
            .setTitle("Classement des invitations !")
            .setDescription("Voici le classement :\n \n" + (row.map((e, i) => { return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)` })).slice(boutonSansString * 10 - 10, boutonSansString * 10).join('\n') + `\n\nBon jeux sur ${config.informations.serverName} !`)
            .setColor(config.embedColor)

          /** 
           * *
           * *
           * * LES BOUTONS
           * *
           * *
           */

          let boutons

          if (row.length <= boutonSansString * 10) {
            boutons = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId(`precedent:${boutonSansString - 1}`)
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId(`suivant:${boutonSansString + 1}`)
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY')
                  .setDisabled(true),
              )
          } else {
            boutons = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId(`precedent:${boutonSansString - 1}`)
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId(`suivant:${boutonSansString + 1}`)
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY'),
              )
          }



          msg.edit({ embeds: [embedSuivant], components: [boutons] })

        } else if (i.customId === 'home') {

          const msg = await interaction.channel.messages.fetch(i.message.id)

          let btn2

          const embed = new MessageEmbed()
            .setTitle("Classement des invitations !")
            .setDescription("Voici le classement :\n \n" + (row.map((e, i) => { return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)` })).slice(0, 10).join('\n') + `\n\nBon jeux sur ${config.informations.serverName} !`)
            .setColor(config.embedColor)


          if (row.length <= 10) {

            btn2 = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('precedent:1')
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY')
                  .setDisabled(true),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId('suivant:2')
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY')
                  .setDisabled(true),
              )
          } else {
            btn2 = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('precedent:1')
                  .setLabel('Page précedente')
                  .setStyle('PRIMARY')
                  .setDisabled(true),

                new MessageButton()
                  .setCustomId('home')
                  .setLabel('🏠')
                  .setStyle('PRIMARY'),

                new MessageButton()
                  .setCustomId('suivant:2')
                  .setLabel('Page suivante')
                  .setStyle('PRIMARY'),

              )
          }

          msg.edit({ embeds: [embed], components: [btn2] })

        }

      })
    })
  }
}