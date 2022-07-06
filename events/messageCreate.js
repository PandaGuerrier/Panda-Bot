const { MessageEmbed } = require("discord.js")
const config = require("../config/config.json")

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.channel.id === config.channels.suggestion) {
      if (message.author.bot) return

      await message.delete()

      const embed = new MessageEmbed()
        .setTitle('Nouvelle Suggestion')
        .addFields(
          { name: 'Suggestion de :', value: `${message.author.tag}`, inline: false },
          { name: 'Suggestion :', value: message.content, inline: false }
        )
        .setThumbnail(message.author.displayAvatarURL()).setColor(config.embedColor)

      await message.channel.send({ embeds: [embed] })
        .then((s) => {

          s.react("✅")
          s.react("❌")

        })
    }
  }
}

