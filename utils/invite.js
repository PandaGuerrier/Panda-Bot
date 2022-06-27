const db = require("./database.js").getDB()

class Invite {
  constructor(inviter, invitee) {
    this.inviter = inviter
    this.invitee = invitee
    this.invite = invite
  }

  welcome() {
    const dataInviter = db.get(`SELECT * FROM inviter WHERE id = ${inviter.id}`)
    if (!dataInviter) {
      db.run(`INSERT INTO inviter (pseudo, id, numero, partie, normal, bonus) VALUES ('${removeEmojis(inviter.tag)}', '${inviter.id}', '1', '0', '1', '0')`)
    } else {
      db.run(`UPDATE inviter SET numero='${dataInviter.numero + 1}', normal='${dataInviter.normal + 1}' WHERE id = ${inviter.id}`)
    }

    const dataUser = db.get(`SELECT * FROM users WHERE id = ${member.user.id}`)
    if (!dataUser) {
      db.run(`INSERT INTO users (inviterName, inviterId, id, code) VALUES ('${removeEmojis(inviter.tag)}', '${inviter.id}', '${member.user.id}', '${code}')`)
    } else {
      db.run(`UPDATE users SET inviterName='${removeEmojis(inviter.tag)}', inviterId='${inviter.id}' WHERE id = ${member.user.id}`)
    }
  }

  goodBye() {
    const dataUser = db.get(`SELECT * FROM users WHERE id='${member.user.id}'`)
    if (!dataUser) {
      return (async () => {
        const newInvites = await member.guild.invites.fetch()

        newInvites.each(inv => cachedInvites.set(inv.code, inv.uses))
        member.client.invites.set(member.guild.id, cachedInvites)
      })
    } else {

      const dataInviter = db.get(`SELECT * FROM inviter WHERE id='${dataUser.inviterId}'`)

      if (!dataInviter) {
        db.run(`INSERT INTO inviter (pseudo, id, numero, partie, normal, bonus) VALUES ('${removeEmojis(dataInviter.inviterName)}', '${dataInviter.inviterId}', '0', '1', '1', '0')`)
      } else {

        db.run(`UPDATE inviter SET partie='${dataInviter.partie + 1}', numero='${dataInviter.numero - 1}' WHERE id='${dataInviter.inviterId}'`)

        db.run(`DELETE FROM users WHERE id='${member.user.id}'`)
      }
    }
  }
  recharge() {

  }
}

function removeEmojis(string) {
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
  return string.replace(regex, '')
}

module.exports = Invite