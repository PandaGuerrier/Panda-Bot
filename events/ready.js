const config = require("../config/config.json")
const Invite = require("../utils/invite")

module.exports = {
  name: 'ready',
  async execute(client) {

    console.log("Connect\u00e9 ❤️")

    const guild = client.guilds.cache.get(config.informations.serverId)
    const invites = await guild.invites.fetch()

    const codeUses = new Map()
    invites.each(inv => codeUses.set(inv.code, inv.uses))

    client.invites.set(guild.id, codeUses)

    client.user.setActivity(`${config.informations.status}`, {
      type: "PLAYING",
    })
    setInterval(async () => {
      await guild.channels.cache.get(config.channels.stats).setName(`📝・${guild.memberCount} membres`)
    }, 15000);
  }
}