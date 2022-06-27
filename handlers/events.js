const fs = require("fs")

module.exports = (client) => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`../events/${file}`)
            client.on(event.name, (...client) => event.execute(...client))
    }
    
    console.log("Events : ✔️")
}