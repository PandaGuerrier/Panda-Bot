const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../config/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Volumer une musique')
    .addIntegerOption(option => option.setName('volume').setDescription('Le volume').setRequired(true)),

  async execute(interaction) {

    const volume = interaction.options.getInteger("volume")

    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "Vous n'êtes dans aucun channel vocal !", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "Vous n'êtes pas dans **mon** channel vocal !", ephemeral: true });

    const queue = interaction.client.player.getQueue(interaction.guild)
    if (!queue) return await interaction.reply({ content: "Il n'y a pas de musique en cours !", ephemeral: true });

    const embedvolume = new MessageEmbed()
    .setTitle(`Le volume est à ${volume}% !`)
    .setColor(config.embedColor)

    queue.setVolume(volume);
    await interaction.reply({ embeds: [embedvolume] }); 
  }
}