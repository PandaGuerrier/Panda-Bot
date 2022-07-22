const { removeEmojis } = require('./functions')

class AntiBot {
  constructor(bot) {
    this.bot = bot
  }

  add() {
    console.log(this.bot)
    const userBotDatabase = this.bot.client.db.models.Bots.findOne({
      where: {
        id: this.bot.user.id
      }
    })

    if (!userBotDatabase) {
      this.bot.client.db.models.Bots.create({
        id: this.bot.user.id,
        pseudo: removeEmojis(this.bot.user.tag)
      })

      this.bot.kick({ reason: "BOT" })

    } else {

      this.bot.client.db.models.Bots.update({
        pseudo: removeEmojis(this.bot.user.tag)
      }, {
        where: {
          id: this.bot.user.id
        }
      })

      this.bot.kick({ reason: "BOT" })
    }
  }
}

module.exports = AntiBot