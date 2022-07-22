const config = require("../config/config.json")
const { MessageEmbed } = require("discord.js")
const Invite = require("../utils/invite")
const AntiBot = require("../utils/antibot")

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (member.user.bot) return;

    await member.guild.channels.cache.get(config.channels.stats).setName(`📝・${member.guild.memberCount} membres`)

    const channelBienvenue = member.guild.channels.cache.get(config.channels.bienvenue)
    const cachedInvites = member.client.invites.get(member.guild.id)
    const invitesList = await member.guild.invites.fetch()
    const invite = invitesList.find(inv => cachedInvites.get(inv.code) < inv.uses)

    if (!invite) {
      const bienvenueEmbed = new MessageEmbed()
        .setTitle("Bienvenue sur " + config.informations.serverName + " !")
        .setDescription("Bienvenue à toi " + member.user.tag + " sur le serveur.\n\nNous sommes désormais  **" + member.guild.memberCount + "** membres.").setColor(config.embedColor)
        .setThumbnail(member.displayAvatarURL())
      await channelBienvenue.send({ embeds: [bienvenueEmbed] })
    } else {
      new Invite(member, invite.inviter, invite.code).welcome()

      const bienvenueEmbed = new MessageEmbed()
        .setTitle("Bienvenue sur " + config.informations.serverName + " !")
        .setDescription("Bienvenue à toi " + member.user.tag + " sur le serveur.\nIl a été invité par " + invite.inviter.tag + "\n\nNous sommes désormais  **" + member.guild.memberCount + "** membres.").setColor(config.embedColor)
        .setThumbnail(member.displayAvatarURL())
      await channelBienvenue.send({ embeds: [bienvenueEmbed] })
    }

    invitesList.each(inv => cachedInvites.set(inv.code, inv.uses))
    member.client.invites.set(member.guild.id, cachedInvites)

    setTimeout(async () => {
      if (!member) return
      const roleVerification = member.guild.roles.cache.get(config.roles.bienvenue);
      if (!member.roles.cache.some(r => r.name.toLowerCase() === roleVerification.name.toLowerCase())) {
        if (!member) return

        new AntiBot(member).add()
        console.log("[ANTIBOT] " + member.user.tag + " a été ajouté à la liste des bots")    
      }
    }, 180000);
  }
}