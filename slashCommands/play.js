const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../config/config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Jouer une musique')
    .addStringOption(option => option.setName('musique').setDescription('La musique').setRequired(true)),

  async execute(interaction) {

    const musique = interaction.options.getString("musique")

    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "Vous n'êtes dans aucun channel vocal !", ephemeral: true });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "Vous n'êtes pas dans **mon** channel vocal !", ephemeral: true });

    const queue = interaction.client.player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });
    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.reply({ content: "Je n'arrive pas à rejoindre votre vocal !", ephemeral: true });
    }
    const track = await interaction.client.player.search(musique, {
      requestedBy: interaction.user
    })
      .then(x => x.tracks[0]);

    if (!track) return await interaction.reply({ content: `Je n'ai pas trouvé la musique :'(`, ephemeral: true });

    track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track);
    if (!queue.playing) await queue.play();

    const embedMusique = new MessageEmbed()
    .setTitle(`${track.title}`)
    .setURL(`${track.url}`)
    .setDescription(`J'ai ajouté la musique : ${track.title} à la queue !`)
    .setColor(config.embedColor)
    .setThumbnail(track.thumbnail)

    await interaction.reply({ embeds: [embedMusique] });
  }
}