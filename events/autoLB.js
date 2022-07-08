const config = require("../config/config.json")
const Discord = require("discord.js")

module.exports = {
	name: 'ready',
	execute(client) {
		setInterval(async () => {

			const isActif = await client.db.models.Setup.findOne({ where: { actif: true } })

			if (!isActif) return

			const channel = client.channels.cache.get(isActif.dataValues.channelId)

			if (!channel) return

			const msg = await channel.messages.fetch(isActif.dataValues.id)

			if (!msg) return

			const inviteAll = await client.db.models.Inviter.findAll()

			const embedFail = new Discord.MessageEmbed()
				.setDescription("Aucun classement pour le moment !")
				.setColor(config.embedColor)

			if (inviteAll.length <= 0) return msg.edit({
				embeds: [embedFail]
			})

			const embed = new Discord.MessageEmbed()
				.setTitle("Classement des invitations !")
				.setDescription("Voici le classement :\n \n" + (inviteAll.map((e, i) => { return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)` })).slice(0, 10).join('\n') + `\n\n${inviteAll.length > 10 ? `Et ${inviteAll.length - 10} autres participants !` : `Bon jeux sur ${config.informations.serverName} !`}`)
				.setColor(config.embedColor)

			await msg.edit({
				embeds: [embed]
			})
		}, 10000)
	}
}