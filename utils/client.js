const anticrash = require("./anticrash")
const files = require("./nodeFiles.js")
const { Collection, Client } = require("discord.js")
const { Sequelize } = require('sequelize');
const { registerAllDB } = require("../utils/database")
const { Player } = require("discord-player");

class PandaClient {
    constructor(token) {
        this.token = token
    }
    login() {
        const client = new Client({ fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: 32767, presence: { status: "online" } })

        client.db = new Sequelize({
            dialect: 'sqlite',
            storage: './database.db',
            define: {
                freezeTableName: true
            },
            logging: false
        });

        registerAllDB(client)
        files(client)
        anticrash()

        client.commands = new Collection()
        client.invites = new Collection()
        client.player = new Player(client)

        client.login(this.token)
    }
}

module.exports = PandaClient