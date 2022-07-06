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

    const invite = await interaction.client.db.models.Invite.findOne({
      where: {
        id: membre.id
      }
    })

    if (!invite) {
      await interaction.client.db.models.Invite.create({
        id: membre.id,
        actuelle: actuelle,
        normale: normale,
        partie: partie,
        bonus: bonus
      })

      const embedRien = new MessageEmbed()
        .setDescription(`${membre} (${membre.username}) a maintenant ${actuelle} invitations (${normale} normales, ${partie} parties, ${bonus} bonus)`)
        .setColor(config.embedColor)

      interaction.reply({ embeds: [embedRien], ephemeral: true })

    } else {

      if (esChoix == 'edit') {
        await interaction.client.db.models.Invite.update({
          actuelle: actuelle + invite.dataValues.actuelle,
          normale: normale + invite.dataValues.normale,
          partie: partie + invite.dataValues.partie,
          bonus: bonus + invite.dataValues.bonus
        }, {
          where: {
            id: membre.id
          }
        })

        const embedEdit = new MessageEmbed()
          .setDescription(`${membre} (${membre.username}) a maintenant ${actuelle + invite.dataValues.numero} invitation(s) (${normale + invite.dataValues.normal} normale(s), ${partie + invite.dataValues.partie} partie(s), ${bonus + invite.dataValues.bonus} bonu(s))`)
          .setColor(config.embedColor)

        interaction.reply({ embeds: [embedEdit], ephemeral: true })

      } else if (esChoix == 'set') {

        await interaction.client.db.models.Invite.update({
          actuelle: actuelle,
          normale: normale,
          partie: partie,
          bonus: bonus
        }, {
          where: {
            id: membre.id
          }
        })

        const embedSet = new MessageEmbed()
          .setDescription(`${membre} (${membre.username}) a maintenant ${actuelle} invitation(s) (${normale} normale(s), ${partie} partie(s), ${bonus} bonu(s))`)
          .setColor(config.embedColor)

        interaction.reply({ embeds: [embedSet], ephemeral: true })
      }
    }
  },
}