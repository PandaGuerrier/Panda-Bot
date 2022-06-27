const anticrash = require("./anticrash")
const files = require("./nodeFiles.js")
const { Collection, Client } = require("discord.js")

class PandaClient {
    constructor(token) {
        this.token = token
    } 
    login() {
        const client = new Client({ fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: 32767, presence: { status: "online" } })

        files(client)
        anticrash()

        client.commands = new Collection()
        client.invites = new Collection()

        client.login(this.token)
    }
}

module.exports = PandaClient