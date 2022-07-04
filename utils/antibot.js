const db = require("./database").getDB()

class AntiBot {
    constructor(bot) {
        this.bot = bot
    }

    add() {
        db.get(`SELECT * FROM bots WHERE id = ${this.bot.id}`, (err, row) => {
            if (!row) {
              db.run(`INSERT INTO bots (pseudo, id) VALUES ('${removeEmojis(this.bot.user.tag)}', '${this.bot.id}')`)

              this.bot.kick({ reason: "BOT" })

            } else {

              db.run(`UPDATE bots SET pseudo='${removeEmojis(this.bot.user.tag)}' WHERE id='${this.bot.id}'`)
              this.bot.kick({ reason: "BOT" })

            }
          })
    }
}

module.exports = AntiBot