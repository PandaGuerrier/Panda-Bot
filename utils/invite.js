const { removeEmojis } = require("../utils/functions.js")

class Invite {
  constructor(member, inviter, code) {
    this.member = member
    this.inviter = inviter
    this.code = code
  }

  async welcome() {
    const inviterDB = await this.member.client.db.models.Inviter.findOne({ where: { id: this.inviter.id } })

    const inviteeDB = await this.member.client.db.models.Users.findOne({ where: { id: this.member.id } })

    if (!inviterDB) {
      await this.member.client.db.models.Inviter.create({
        id: this.inviter.id,
        pseudo: removeEmojis(this.inviter.tag),
        numero: 1,
        partie: 0,
        normal: 1,
        bonus: 0
      })
    } else {
      await this.member.client.db.models.Inviter.update({
        numero: inviterDB.dataValues.numero + 1,
        normal: inviterDB.dataValues.normal + 1
      }, { where: { id: this.inviter.id } })
    }

    if (!inviteeDB) {
      await this.member.client.db.models.Users.create({
        id: this.member.id,
        code: this.code,
        inviterName: removeEmojis(this.inviter.tag),
        inviterId: this.inviter.id
      })
    } else {
      await this.member.client.db.models.Users.update({
        code: this.code,
        inviterName: removeEmojis(this.inviter.tag),
        inviterId: this.inviter.id
      }, { where: { id: this.member.id } })
    }
  }

  async goodBye() {
    const inviteeDB = await this.member.client.db.models.Users.findOne({ where: { id: this.member.id } })

    if (!inviteeDB) {
      return
    } else {

      const inviterDB = await this.member.client.db.models.Inviter.findOne({ where: { id: inviteeDB.dataValues.inviterId } })
      console.log(inviteeDB)
      console.log(inviterDB)
      if (!inviterDB) {
        return
      } else {
        await this.member.client.db.models.Inviter.update({
          numero: inviterDB.dataValues.numero - 1,
          partie: inviterDB.dataValues.partie + 1,
        }, { where: { id: inviteeDB.dataValues.inviterId } })
      }
      
    }
  }

  recharge(invite) {
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

module.exports = Invite

// https://discord.gg/AXY3bydk

// join good
// goodbye no

//      this.member.client.db.models.Users.destroy({ where: { id: this.member.id } })
