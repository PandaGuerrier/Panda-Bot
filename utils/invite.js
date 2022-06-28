const { getDB } = require("./database.js")
const { removeEmojis } = require("../utils/functions.js")
const { data } = require("../slashCommands/create.js")
class Invite {
  constructor(inviter, invitee, code) {
    this.inviter = inviter
    this.invitee = invitee
    this.code = code
  }

  welcome() {
    getDB().get(`SELECT * FROM inviter WHERE id = ${this.inviter.id}`, (err, dataInviter) => {
    if (!dataInviter) {
      getDB().run(`INSERT INTO inviter (pseudo, id, numero, partie, normal, bonus) VALUES ('${removeEmojis(this.inviter.tag)}', '${this.inviter.id}', '1', '0', '1', '0')`)
    } else {
      getDB().run(`UPDATE inviter SET numero='${dataInviter.numero + 1}', normal='${dataInviter.normal + 1}' WHERE id = ${this.inviter.id}`)
    }
    })
    getDB().get(`SELECT * FROM users WHERE id = ${this.invitee.user.id}`, (err, dataUser) => {
      if (!dataUser) {
        getDB().run(`INSERT INTO users (inviterName, inviterId, id, code) VALUES ('${removeEmojis(this.inviter.tag)}', '${this.inviter.id}', '${this.invitee.user.id}', '${this.code}')`)
      } else {
        getDB().run(`UPDATE users SET inviterName='${removeEmojis(this.inviter.tag)}', inviterId='${this.inviter.id}' WHERE id = ${this.invitee.user.id}`)
      }
  })
  }

 async goodBye(member) {
   getDB().get(`SELECT * FROM users WHERE id='${member.user.id}'`, (err, dataUser) => {

    if (!dataUser) {
      return
    } else {

      const dataInviter = getDB().get(`SELECT * FROM inviter WHERE id='${dataUser.inviterId}'`)

      if (!dataInviter) {
        getDB().run(`INSERT INTO inviter ('pseudo', 'id,' 'numero', 'partie', 'normal', 'bonus') VALUES ('${removeEmojis(dataInviter.inviterName)}', '${dataInviter.inviterId}', '0', '1', '1', '0')`)
      } else {
        getDB().run(`UPDATE inviter SET partie='${dataInviter.partie + 1}', numero='${dataInviter.numero - 1}' WHERE id='${dataInviter.inviterId}'`)

        getDB().run(`DELETE FROM users WHERE id='${member.user.id}'`)
      }
    }
  })
  }
}



module.exports = Invite