const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clone')
        .setDescription('Clone le channel'),

    async execute(interaction) {

        const chan = await interaction.channel.clone(undefined, true, false, 'clonage du channel')
        interaction.channel.delete()
        chan.setPosition(interaction.channel.position)

        const embed = new Discord.MessageEmbed()
            .setTitle("CLONE")
            .setDescription("J'ai bien clon\u00e9 le channel : " + chan.name + " !")
            .setColor(config.embedColor)
            .setImage("https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif")

        chan.send({ embeds: [embed] }).then((msg) => {

            setTimeout(() => {
                msg.delete()
            }, 6000)
        })

    }
}