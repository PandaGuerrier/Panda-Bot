const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../config/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('looper une musique'),

  async execute(interaction) {

    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "Vous n'êtes dans aucun channel vocal !", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "Vous n'êtes pas dans **mon** channel vocal !", ephemeral: true });

    const queue = interaction.client.player.getQueue(interaction.guild)
    if (!queue) return await interaction.reply({ content: "Il n'y a pas de musique en cours !", ephemeral: true });

    if(queue.repeatMode === 0) {
      const embedLoopOui = new MessageEmbed()
      .setTitle(`La musique est en looooooooooop !`)
      .setColor(config.embedColor)

      queue.setRepeatMode(1);
      return await interaction.reply({ embeds: [embedLoopOui], ephemeral: true }); 
    } else {
      const embedLoopNon = new MessageEmbed()
      .setTitle(`La musique n'est plus en loop :'( !`)
      .setColor(config.embedColor)
      
      queue.setRepeatMode(0);
      await interaction.reply({ embeds: [embedLoopNon], ephemeral: true }); 
    }
  }
}