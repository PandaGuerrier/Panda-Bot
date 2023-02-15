
module.exports = {
  name: 'presenceUpdate',
  async execute(_oldPresence, newPresence) {
    const role = newPresence.member.guild.roles.cache.find(role => role.id === config.roles.status)
    const activity = newPresence.activities[0]

    if(!activity || activity.status === 'offline') return

    if(activity && (activity.state.includes('jedisky') || activity.state.includes('discord.gg/jedisky'))) {
      newPresence.member.roles.add(role)
    } else  {
      newPresence.member.roles.remove(role)
    }
  }
}