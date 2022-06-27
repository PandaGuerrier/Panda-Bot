const fs = require('fs');

function anticrash() {
    process.on('unhandledRejection', error => {
        console.error('Uncaught Promise Error: \n', error)
        if (!fs.existsSync('./logs')) {
          fs.mkdirSync('./logs')
        }
          fs.appendFile(`logs/${Date()}.txt`, `${error}\n`, (err) => {
            if (err) console.error(err)
          })
      })
}

module.exports = anticrash