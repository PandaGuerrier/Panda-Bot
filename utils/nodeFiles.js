const fs = require('fs');

function files(client) {
    const list = ["events", "slashCommands", "musique"]
    list.forEach(file => {
      fs.readdir(`../${file}`, () => {
          require(`../handlers/${file}.js`)(client)
      })
    })
}

module.exports = files