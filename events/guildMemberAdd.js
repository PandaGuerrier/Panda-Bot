const config = require("../config/config.json")
const Discord = require("discord.js")
const Invite = require("../utils/invite")
const AntiBot = require("../utils/antibot")

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (member.user.bot) return;
    const channelBienvenue = member.guild.channels.cache.get(config.channels.bienvenue)
    try {
      const cachedInvites = member.client.invites.get(member.guild.id)

      const invitesList = await member.guild.invites.fetch()

      try {
        const invite = invitesList.find(inv => cachedInvites.get(inv.code) < inv.uses)

        if (!invite) {
          const bienvenueEmbed = new Discord.MessageEmbed()
            .setTitle("Bienvenue sur " + config.informations.nom + " !")
            .setDescription("Bienvenue à toi " + member.user.tag + " sur le serveur.\n\nNous sommes désormais  **" + member.guild.memberCount + "** membres.").setColor(config.embedColor)
            .setThumbnail(member.displayAvatarURL())

          await channelBienvenue.send({ embeds: [bienvenueEmbed] })

        } else {

          new Invite(invite.inviter, member).welcome()

          const bienvenueEmbed = new Discord.MessageEmbed()
            .setTitle("Bienvenue sur " + config.informations.nom + " !")
            .setDescription("Bienvenue à toi " + member.user.tag + " sur le serveur.\nIl a été invité par " + invite.inviter.tag + "\n\nNous sommes désormais  **" + member.guild.memberCount + "** membres.").setColor(config.embedColor)
            .setThumbnail(member.displayAvatarURL())
          await channelBienvenue.send({ embeds: [bienvenueEmbed] })
        }
      } catch (err) {
        console.error(err)
      }
      invitesList.each(inv => cachedInvites.set(inv.code, inv.uses))
      member.client.invites.set(member.guild.id, cachedInvites)

      setTimeout(async () => {
        const roleVerification = member.guild.roles.cache.get(config.roles.bienvenue);

        if (!member.roles.cache.some(r => r.name.toLowerCase() === roleVerification.name.toLowerCase())) {
          if (!member) return
          new AntiBot.add(member)

        } else {
          return
        }
      }, 180000);


    } catch (err) {
      console.log("OnGuildMemberAdd Error:", err)
    }
  }
}