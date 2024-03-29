const fs = require('fs')
require('dotenv').config()
const config = require("../config/config.json")

module.exports = (client) => {
const commands = []

for (const file of fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'))) {
	const command = require(`../slashCommands/${file}`)
	client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
}

    client.on("ready", async() => {
        const guild = client.guilds.cache.get(config.informations.serverId)
        const cmd = await guild.commands.set(commands)
        
        console.log(cmd.map(cmd => "Commande: " + cmd.name + " ✔️").join('\n'))
      })
}