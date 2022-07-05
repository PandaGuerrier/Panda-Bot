const config = require("../config/config.json")
const Discord = require("discord.js")

module.exports = {
	name: 'ready',
	execute(client) {
		setInterval(async () => {

			const isActif = await client.db.models.Setup.findOne({ where: { actif: true } })

			if (!isActif) return

			const channel = client.channels.cache.get(isActif.channelId)

			if (!channel) return

			channel.messages.fetch(isActif.id).then(async msg => {

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
					.setDescription("Voici le classement :\n \n" + (inviteAll.map((e, i) => {return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)`})).slice(0, 10).join('\n') + `\n\n${row.length > 10 ? `Et ${row.length - 10} autres participants !` : `Bon jeux sur ${config.informations.serverName} !`}`)
					.setColor(config.embedColor)

				await msg.edit({
					embeds: [embed]
				})
			}).catch(() => { console.log("Le message du auto Leaderboard a été supprimé, remetez le !") })
		}, 10000)
	}
}