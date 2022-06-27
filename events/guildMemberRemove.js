const { Invite } = require("discord.js")

module.exports = { 
    name: 'guildMemberRemove',
       async execute(member) {
        if(member.user.bot) return

            new Invite().goodBye(member)
            const cachedInvites = member.client.invites.get(member.guild.id)
            const newInvites = await member.guild.invites.fetch()

            newInvites.each(inv => cachedInvites.set(inv.code, inv.uses))
            member.client.invites.set(member.guild.id, cachedInvites)
     }
}