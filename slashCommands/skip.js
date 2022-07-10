const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../config/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skip une musique'),

  async execute(interaction) {

    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "Vous n'êtes dans aucun channel vocal !", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "Vous n'êtes pas dans **mon** channel vocal !", ephemeral: true });

    const queue = interaction.client.player.getQueue(interaction.guild)
    if (!queue) return await interaction.reply({ content: "Il n'y a pas de musique en cours !", ephemeral: true });

    if(!queue.tracks[0 + 1]) return interaction.reply({ content: "Il n'y a pas de musique à skip !", ephemeral: true });
    
    queue.skip();
    const embedSkip = new MessageEmbed()
    .setTitle(`J'ai bien skip la musique, je joue désormais ${queue.tracks[0].title} !`)
    .setColor(config.embedColor)

    await interaction.reply({ embeds: [embedSkip] }); 
  }
}