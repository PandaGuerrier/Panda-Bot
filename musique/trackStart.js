const { MessageEmbed } = require("discord.js");
const config = require("../config/config.json");

module.exports = {
  name: 'trackStart',
  async execute(queue, track) {
      const embedMusique = new MessageEmbed()
      .setTitle(`${track.title}`)
      .setURL(`${track.url}`)
      .setDescription(`Je joue la musique : ${track.title} !`)
      .setColor(config.embedColor)
      .setThumbnail(track.thumbnail)

      queue.metadata.channel.send({embeds: [embedMusique]});
  }
}