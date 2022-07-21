const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../config/config.json')
const finder = require("lyrics-finder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription("Les lyrics d'une musique"),

  async execute(interaction) {

    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "Vous n'êtes dans aucun channel vocal !", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "Vous n'êtes pas dans **mon** channel vocal !", ephemeral: true });

    const queue = interaction.client.player.getQueue(interaction.guild)
    if (!queue) return await interaction.reply({ content: "Il n'y a pas de musique en cours !", ephemeral: true });
      
    const lyrics = await finder(queue.current.title, "")
    
    if(!lyrics) return await interaction.reply({ content: "Aucun résultat !", ephemeral: true });

    const embedLyrics = new MessageEmbed()
    .setTitle(`Lyrics de ${queue.current.title}`)
    .setDescription(`${lyrics}`)
    .setColor(config.embedColor)


    await interaction.reply({ embeds: [embedLyrics] }); 
  }
}