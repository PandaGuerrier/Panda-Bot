module.exports = { 
    name: 'inviteCreate',
     async execute(invite) {
        invite.client.guilds.cache.forEach(guild => {
            guild.invites.fetch()
                .then(invites => {
      
                  const codeUses = new Map()
                    invites.each(inv => codeUses.set(inv.code, inv.uses))
      
                    invite.client.invites.set(guild.id, codeUses)
                })
                .catch(err => {
                    console.log(err)
                })
            })
     }
  }
  