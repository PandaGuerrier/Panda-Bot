const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require("../config/config.json")
const Discord = require("discord.js")
const db = require("../utils/database").getDB()

  module.exports = {
      data: new SlashCommandBuilder()
          .setName('autolb')
          .setDescription("Parametrer l'autoLeaderBoard")
          .addStringOption(option =>
            option.setName('quoi')
                .setDescription('Que veut tu faire ?')
                .setRequired(true)
                .addChoice('Setup', 'setup')
                .addChoice('Remove', 'remove')),

      async execute(client, interaction) {
        const menu = interaction.options.getString("quoi") 

        if(menu == 'remove') {

        
            db.get(`SELECT * FROM setup`, (err, row) => {
              if (!row) {
                db.run(`INSERT INTO setup (actif) VALUES ('${false}')`)
                } else {
                  db.run(`UPDATE setup SET actif='${false}'`)
                }
        
                interaction.reply({content: "Le leaderboard est maintenant désactivé !", ephemeral: true})
        
        
              })
            } else {
        
                  const embed = new Discord.MessageEmbed()
                  .setTitle("INSTALLATION...")
                  .setColor(config.embedColor)
        
                  interaction.channel.send({embeds: [embed]}).then(msg => {
        
                    db.get(`SELECT * FROM setup`, (err, row) => {
                      if (!row) {
                        db.run(`INSERT INTO setup (id, channelId, actif) VALUES ('${msg.id}', '${interaction.channel.id}','${true}')`)
                        } else {
                          db.run(`UPDATE setup SET id='${msg.id}', actif='${true}', channelId='${interaction.channel.id}'`)
                        }
        
                        interaction.reply({content: "Le leaderboard est en cours d'installation, il va bientôt s'actualiser !", ephemeral: true})
        
        
                      })
        
                  })
            }
      },
  }