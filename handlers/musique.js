const fs = require("fs")

module.exports = (client) => {
    const musiqueFiles = fs.readdirSync('./musique').filter(file => file.endsWith('.js'))

    for (const file of musiqueFiles) {
        const event = require(`../musique/${file}`)
            client.player.on(event.name, (queue, track) => event.execute(queue, track))
    }
    
    console.log("Musique : ✔️")
}