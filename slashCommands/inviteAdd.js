const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const db = require("../utils/database").getDB()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inviteadd')
    .setDescription('Ajouter des invitations')
    .addUserOption(option => option.setName('membre').setDescription('Ajouter des invitations a cette personne').setRequired(true))
    .addStringOption(option =>
      option.setName('faire')
        .setDescription('Choisi')
        .setRequired(true)
        .addChoices({ name: 'Set (Mettre)', value: 'set' })
        .addChoices({ name: 'Edit (Modifier)', value: 'edit' }))
    .addIntegerOption(option => option.setName('actuelle').setDescription('Les invitations actuelles').setRequired(true))
    .addIntegerOption(option => option.setName('normale').setDescription('Les invitations normales').setRequired(true))
    .addIntegerOption(option => option.setName('partie').setDescription('Les parties').setRequired(true))
    .addIntegerOption(option => option.setName('bonus').setDescription('Les invitations bonus').setRequired(true)),

  async execute(interaction) {

    const membre = interaction.options.getUser("membre")
    const esChoix = interaction.options.getString("faire")
    const actuelle = interaction.options.getInteger("actuelle")
    const normale = interaction.options.getInteger("normale")
    const partie = interaction.options.getInteger("partie")
    const bonus = interaction.options.getInteger("bonus")

    db.get(`SELECT * FROM inviter WHERE id = ${membre.id}`, (err, row) => {
      if (!row) {
        db.run(`INSERT INTO inviter (pseudo, id, numero, partie, normal, bonus) VALUES ('${membre.tag}', '${membre.id}', '${actuelle}', ${partie}, ${normale}, ${bonus})`)

        const embedRien = new MessageEmbed()
          .setDescription(`${membre} (${membre.username}) à maintenant ${actuelle} invitations (${normale} normales, ${partie} parties, ${bonus} bonus)`)
          .setColor(config.embedColor)

        interaction.reply({ embeds: [embedRien], ephemeral: true })

      } else {

        if (esChoix == 'edit') {
          db.run(`UPDATE inviter SET numero='${row.numero + actuelle}', normal='${row.normal + normale}', partie='${row.partie + partie}', bonus='${row.bonus + bonus}' WHERE id = ${membre.id}`)

          const embedEdit = new MessageEmbed()
            .setDescription(`${membre} (${membre.username}) à maintenant ${actuelle + row.numero} invitations (${normale + row.normal} normales, ${partie + row.partie} parties, ${bonus + row.bonus} bonus)`)
            .setColor(config.embedColor)

          interaction.reply({ embeds: [embedEdit], ephemeral: true })

        } else if (esChoix == 'set') {
          db.run(`UPDATE inviter SET numero='${actuelle}', normal='${normale}', partie='${partie}', bonus='${bonus}' WHERE id = ${membre.id}`)

          const embedSet = new MessageEmbed()
            .setDescription(`${membre} (${membre.username}) à maintenant ${actuelle} invitations (${normale} normales, ${partie} parties, ${bonus} bonus)`)
            .setColor(config.embedColor)

          interaction.reply({ embeds: [embedSet], ephemeral: true })

        }
      }
    })
    db.close()
  },
}