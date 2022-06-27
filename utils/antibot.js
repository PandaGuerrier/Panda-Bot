const db = require("./database").getDB()

class AntiBot {
    constructor(bot) {
        this.bot = bot
    }

    add() {
        db.get(`SELECT * FROM bots WHERE id = ${member.id}`, (err, row) => {
            if (!row) {
              db.run(`INSERT INTO bots (pseudo, id) VALUES ('${removeEmojis(member.user.tag)}', '${member.id}')`)

              member.kick({ reason: "BOT" })

            } else {

              db.run(`UPDATE bots SET pseudo='${removeEmojis(member.user.tag)}' WHERE id='${member.id}'`)
              member.kick({ reason: "BOT" })

            }
          })
    }
}

module.exports = AntiBot