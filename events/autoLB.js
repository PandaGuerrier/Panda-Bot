const config = require("../config/config.json")
const db = require("../utils/database").getDB()
const Discord = require("discord.js")

module.exports = {
  name: 'ready',
  execute(client) {
    setInterval(() => {
      db.get(`SELECT * FROM setup WHERE actif='${true}'`, (err, row) => {

        if (!row) return

        const channel = client.channels.cache.get(row.channelId)

        if (!channel) return

        channel.messages.fetch(row.id).then(msg => {

          if (!msg) return

          db.all(`SELECT * FROM inviter ORDER BY numero DESC`, async (err, row) => {
            if (err) throw err

            const embedFail = new Discord.MessageEmbed()
              .setDescription("Aucun classement pour le moment !")
              .setColor(config.embedColor)

            if (row.length <= 0) return msg.edit({
              embeds: [embedFail]
            })

            const embed = new Discord.MessageEmbed()
              .setTitle("Classement des invitations !")
              .setDescription("Voici le classement :\n \n" + (row.map((e, i) => {
                return `${i + 1}. **${e.pseudo}** avec ${e.numero} invitations, (${e.normal} normale(s), ${e.partie} partie(s), ${e.bonus} bonus)`
              })).slice(0, 10).join('\n') + `\n\n${row.length > 10 ? `Et ${row.length - 10} autres participants !` : `Bon jeux sur ${config.informations.nom} !`}`)
              .setColor(config.embedColor)

            msg.edit({
              embeds: [embed]
            })
          })
        })
          .catch(err => { console.log("Le message du auto Leaderboard a été supprimé, remetez le !") })
      })
    }, 10000)
  }
}