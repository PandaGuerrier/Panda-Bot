const config = require("../config/config.json")

module.exports = {
  name: 'ready',
  async execute(client) {

    console.log("Connect\u00e9 ❤️")
    client.guilds.cache.forEach(guild => {
      guild.invites.fetch()
        .then(invites => {

          const codeUses = new Map()
          invites.each(inv => codeUses.set(inv.code, inv.uses))

          client.invites.set(guild.id, codeUses)
        })
        .catch(err => {
          console.log(err)
        })
    })

    client.user.setActivity(`${config.informations.status}`, {
      type: "PLAYING",
    })
  }
}